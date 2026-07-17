"""
Aggregation Engine — batches a cluster's confirmed (paid) orders, matches
each product to its cheapest available vendor, and records the bulk
savings. Populates the vendor field on each OrderItem, which nothing else
in the codebase sets.
"""
from decimal import Decimal

from django.db import transaction
from django.utils import timezone

from apps.orders.models import Order
from apps.vendors.models import VendorPrice

from .models import AggregationRun, PriceOptimization, VendorAllocation

TWO_PLACES = Decimal('0.01')


class NothingToAggregateError(Exception):
    """Raised when a cluster has no confirmed, unaggregated orders."""


class AggregationEngine:
    """Batches one cluster's confirmed orders into a single AggregationRun."""

    def __init__(self, cluster):
        self.cluster = cluster

    @transaction.atomic
    def run(self) -> AggregationRun:
        orders = list(
            Order.objects.filter(
                cluster=self.cluster,
                status='CONFIRMED',
                aggregation_run__isnull=True,
            ).prefetch_related('items__product')
        )
        if not orders:
            raise NothingToAggregateError(
                f"No confirmed, unaggregated orders found for {self.cluster.name}."
            )

        agg_run = AggregationRun.objects.create(cluster=self.cluster, status='analyzing')
        agg_run.run_number = agg_run.generate_run_number()
        agg_run.save(update_fields=['run_number'])

        quantities, products = self._group_items_by_product(orders)
        unfulfilled, vendor_by_product = self._optimize_prices(agg_run, quantities, products)
        self._assign_vendors(orders, vendor_by_product)
        vendor_totals = self._roll_up_vendor_allocations(agg_run, orders)
        self._finalize_run(agg_run, orders, vendor_totals, unfulfilled)

        Order.objects.filter(id__in=[o.id for o in orders]).update(
            aggregation_run=agg_run, status='PROCESSING',
        )
        return agg_run

    @staticmethod
    def _group_items_by_product(orders):
        """Sum quantities for every product across all the batched orders."""
        quantities: dict[int, Decimal] = {}
        products = {}
        for order in orders:
            for item in order.items.all():
                if item.product_id is None:
                    continue  # combos aren't sourced per-product
                quantities[item.product_id] = quantities.get(item.product_id, Decimal('0')) + item.quantity
                products[item.product_id] = item.product
        return quantities, products

    @staticmethod
    def _optimize_prices(agg_run, quantities, products):
        """Pick the cheapest available vendor per product; record the optimization."""
        unfulfilled = []
        vendor_by_product = {}
        for product_id, total_qty in quantities.items():
            product = products[product_id]
            prices = list(
                VendorPrice.objects.filter(product=product, is_available=True)
                .select_related('vendor')
                .order_by('price')
            )
            if not prices:
                unfulfilled.append(product.name)
                continue

            best = prices[0]
            market_average = (sum(p.price for p in prices) / len(prices)).quantize(TWO_PLACES)

            optimization = PriceOptimization.objects.create(
                aggregation_run=agg_run,
                product=product,
                total_quantity_needed=total_qty,
                selected_vendor=best.vendor,
                selected_price=best.price,
                market_average_price=market_average,
                alternatives_evaluated=len(prices),
            )
            optimization.calculate_savings()
            vendor_by_product[product_id] = best.vendor

        return unfulfilled, vendor_by_product

    @staticmethod
    def _assign_vendors(orders, vendor_by_product):
        """Populate OrderItem.vendor with the winning vendor for its product."""
        for order in orders:
            for item in order.items.all():
                vendor = vendor_by_product.get(item.product_id)
                if vendor is not None:
                    item.vendor = vendor
                    item.save(update_fields=['vendor'])

    @staticmethod
    def _roll_up_vendor_allocations(agg_run, orders):
        """Group newly-assigned order items by vendor into VendorAllocation rows."""
        vendor_totals = {}
        for order in orders:
            for item in order.items.all():
                if item.vendor_id is None:
                    continue
                entry = vendor_totals.setdefault(
                    item.vendor_id, {'vendor': item.vendor, 'items': 0, 'value': Decimal('0')}
                )
                entry['items'] += item.quantity
                entry['value'] += item.subtotal

        for data in vendor_totals.values():
            VendorAllocation.objects.create(
                aggregation_run=agg_run,
                vendor=data['vendor'],
                total_items=data['items'],
                total_value=data['value'],
            )
        return vendor_totals

    @staticmethod
    def _finalize_run(agg_run, orders, vendor_totals, unfulfilled):
        total_order_value = sum((order.total_amount for order in orders), Decimal('0'))
        total_savings = sum(
            (po.total_savings for po in agg_run.price_optimizations.all()), Decimal('0')
        )
        agg_run.total_orders = len(orders)
        agg_run.total_order_value = total_order_value
        agg_run.total_savings = total_savings
        agg_run.average_savings_percentage = (
            (total_savings / total_order_value * 100).quantize(TWO_PLACES)
            if total_order_value else Decimal('0')
        )
        agg_run.vendors_involved = len(vendor_totals)
        agg_run.status = 'completed'
        agg_run.completed_at = timezone.now()
        if unfulfilled:
            agg_run.notes = 'Could not source vendor pricing for: ' + ', '.join(unfulfilled)
        agg_run.save()
