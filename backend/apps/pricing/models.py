"""
Cluster group-buying discount tiers.
"""
from django.db import models


class PricingTier(models.Model):
    """
    A global discount tier: once a cluster's confirmed, unaggregated demand
    for a product reaches min_quantity units, that product's price for
    everyone in the cluster drops by discount_percentage.
    """

    min_quantity = models.PositiveIntegerField(
        unique=True,
        help_text="Confirmed cluster quantity required to unlock this tier",
    )
    discount_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        help_text="Percentage off the base price, e.g. 15.00 for 15%",
    )
    label = models.CharField(max_length=100, blank=True, help_text="e.g. 'Bulk Saver'")

    class Meta:
        db_table = 'pricing_tiers'
        ordering = ['min_quantity']
        verbose_name = 'Pricing Tier'
        verbose_name_plural = 'Pricing Tiers'

    def __str__(self):
        return f"{self.min_quantity}+ units — {self.discount_percentage}% off"
