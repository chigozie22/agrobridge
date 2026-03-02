from django.contrib import admin
from .models import Vendor, VendorPrice

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['name', 'vendor_type', 'phone', 'trust_score', 'is_verified', 'is_active']
    list_filter = ['vendor_type', 'is_verified', 'is_active']
    search_fields = ['name', 'phone']

@admin.register(VendorPrice)
class VendorPriceAdmin(admin.ModelAdmin):
    list_display = ['product', 'vendor', 'price', 'is_available', 'updated_at']
    list_filter = ['is_available', 'vendor', 'updated_at']
    search_fields = ['product__name', 'vendor__name']
