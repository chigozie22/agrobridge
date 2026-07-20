"""
Cluster group-buying price calculation.

The single source of truth for what a product costs a given cluster right
now — used both to display live pricing on the products page and to compute
the authoritative charge at order-creation time. Never let those two drift
apart: always call calculate_price() rather than re-deriving tier logic.
"""
from decimal import Decimal
from django.db.models import Sum
from .models import PricingTier

TWO_PLACES = Decimal('0.01')


def calculate_price(product, cluster):
    """
    Returns the cluster's current price for a product, plus progress toward
    the next discount tier.

    {
        'price': Decimal,
        'current_quantity': int,
        'tier_label': str,
        'next_tier_quantity': int | None,
        'next_tier_price': Decimal | None,
    }
    """
    base_price = product.get_cheapest_price() or Decimal('0')

    if cluster is None:
        return {
            'price': base_price,
            'current_quantity': 0,
            'tier_label': '',
            'next_tier_quantity': None,
            'next_tier_price': None,
        }

    from apps.orders.models import OrderItem

    current_quantity = OrderItem.objects.filter(
        order__cluster=cluster,
        order__status='CONFIRMED',
        order__aggregation_run__isnull=True,
        product=product,
    ).aggregate(qty=Sum('quantity'))['qty'] or 0

    tiers = list(PricingTier.objects.all())
    current_tier = None
    next_tier = None
    for tier in tiers:
        if tier.min_quantity <= current_quantity:
            if current_tier is None or tier.min_quantity > current_tier.min_quantity:
                current_tier = tier
        else:
            if next_tier is None or tier.min_quantity < next_tier.min_quantity:
                next_tier = tier

    if current_tier:
        discount = base_price * (current_tier.discount_percentage / Decimal('100'))
        price = (base_price - discount).quantize(TWO_PLACES)
        tier_label = current_tier.label
    else:
        price = base_price.quantize(TWO_PLACES) if base_price else base_price
        tier_label = ''

    if next_tier:
        next_discount = base_price * (next_tier.discount_percentage / Decimal('100'))
        next_tier_price = (base_price - next_discount).quantize(TWO_PLACES)
        next_tier_quantity = next_tier.min_quantity
    else:
        next_tier_price = None
        next_tier_quantity = None

    return {
        'price': price,
        'current_quantity': current_quantity,
        'tier_label': tier_label,
        'next_tier_quantity': next_tier_quantity,
        'next_tier_price': next_tier_price,
    }
