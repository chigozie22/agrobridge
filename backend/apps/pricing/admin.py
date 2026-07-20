from django.contrib import admin
from .models import PricingTier


@admin.register(PricingTier)
class PricingTierAdmin(admin.ModelAdmin):
    list_display = ['min_quantity', 'discount_percentage', 'label']
    ordering = ['min_quantity']
