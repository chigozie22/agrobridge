from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'cluster', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'cluster', 'created_at']
    search_fields = ['user__name', 'user__phone']
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'vendor', 'quantity', 'unit_price', 'subtotal']
    list_filter = ['vendor', 'created_at']
    search_fields = ['product__name', 'order__user__name']
