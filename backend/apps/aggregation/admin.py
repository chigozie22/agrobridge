from django.contrib import admin
from .models import AggregationRun, PriceOptimization, VendorAllocation


class PriceOptimizationInline(admin.TabularInline):
    model = PriceOptimization
    extra = 0
    readonly_fields = ['savings_per_unit', 'total_savings']


class VendorAllocationInline(admin.TabularInline):
    model = VendorAllocation
    extra = 0


@admin.register(AggregationRun)
class AggregationRunAdmin(admin.ModelAdmin):
    list_display = ['run_number', 'cluster', 'status', 'total_orders', 'total_savings', 'started_at']
    list_filter = ['status', 'cluster']
    search_fields = ['run_number', 'cluster__name']
    readonly_fields = ['run_number', 'started_at', 'completed_at', 'created_at', 'updated_at']
    inlines = [PriceOptimizationInline, VendorAllocationInline]


@admin.register(PriceOptimization)
class PriceOptimizationAdmin(admin.ModelAdmin):
    list_display = ['product', 'aggregation_run', 'selected_vendor', 'selected_price', 'total_savings']
    list_filter = ['aggregation_run__cluster']


@admin.register(VendorAllocation)
class VendorAllocationAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'aggregation_run', 'total_items', 'total_value', 'status']
    list_filter = ['status']
