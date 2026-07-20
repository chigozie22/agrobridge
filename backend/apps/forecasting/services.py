"""
Statistical (non-LLM) supply/demand forecasting for a cluster.

v1 is intentionally a simple, cheap, deterministic baseline — a weekly
history bucketed straight from Order/OrderItem, projected one week ahead
with ordinary least squares. Kept self-contained so it's a clean swap
point if this is later replaced with a trained model.
"""
from datetime import timedelta
from django.db.models import Sum
from django.utils import timezone

from apps.orders.models import OrderItem
from apps.products.models import Product
from apps.vendors.models import VendorPrice

COMMITTED_STATUSES_EXCLUDED = ['PENDING', 'CANCELLED']
FLAT_SLOPE_TOLERANCE = 0.1  # units/week within this band is reported as 'flat'


def forecast_cluster_demand(cluster, weeks_back=8):
    """
    Returns a list of per-product demand forecasts for a cluster, sorted by
    projected next-week quantity descending. Products with no order history
    in the window are omitted entirely.
    """
    since = timezone.now() - timedelta(weeks=weeks_back)

    rows = OrderItem.objects.filter(
        order__cluster=cluster,
        order__created_at__gte=since,
        product__isnull=False,
    ).exclude(
        order__status__in=COMMITTED_STATUSES_EXCLUDED,
    ).values_list('product_id', 'quantity', 'order__created_at')

    weekly_by_product = {}
    for product_id, quantity, created_at in rows:
        week_index = min((created_at.date() - since.date()).days // 7, weeks_back - 1)
        series = weekly_by_product.setdefault(product_id, [0] * weeks_back)
        series[week_index] += quantity

    if not weekly_by_product:
        return []

    products_map = {p.id: p for p in Product.objects.filter(id__in=weekly_by_product.keys())}

    stock_rows = VendorPrice.objects.filter(
        product_id__in=weekly_by_product.keys(), is_available=True,
    ).values('product_id').annotate(total_stock=Sum('stock_quantity'))
    stock_map = {row['product_id']: row['total_stock'] for row in stock_rows}

    results = []
    for product_id, weekly_qty in weekly_by_product.items():
        product = products_map.get(product_id)
        if product is None:
            continue

        data_points = sum(1 for qty in weekly_qty if qty > 0)
        if data_points == 0:
            continue

        projected, trend = _project_next_period(weekly_qty)

        results.append({
            'product_id': product_id,
            'product_name': product.name,
            'unit': product.unit,
            'weekly_history': weekly_qty,
            'projected_next_week_quantity': projected,
            'trend': trend,
            'data_points': data_points,
            'cheapest_price': product.get_cheapest_price(),
            'known_vendor_stock': stock_map.get(product_id),
        })

    results.sort(key=lambda r: r['projected_next_week_quantity'], reverse=True)
    return results


def _project_next_period(weekly_qty):
    """Ordinary-least-squares projection one period past a zero-filled weekly series."""
    n = len(weekly_qty)
    nonzero_indices = [i for i, qty in enumerate(weekly_qty) if qty > 0]

    if len(nonzero_indices) <= 1:
        last_value = weekly_qty[nonzero_indices[0]] if nonzero_indices else 0
        return last_value, 'flat'

    xs = list(range(n))
    mean_x = sum(xs) / n
    mean_y = sum(weekly_qty) / n
    numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, weekly_qty))
    denominator = sum((x - mean_x) ** 2 for x in xs)
    slope = numerator / denominator if denominator else 0
    intercept = mean_y - slope * mean_x

    projected = max(0, round(slope * n + intercept))

    if slope > FLAT_SLOPE_TOLERANCE:
        trend = 'up'
    elif slope < -FLAT_SLOPE_TOLERANCE:
        trend = 'down'
    else:
        trend = 'flat'

    return projected, trend
