from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']


def make_status_action(new_status, label):
    def action(modeladmin, request, queryset):
        updated = queryset.update(status=new_status)
        modeladmin.message_user(request, f'{updated} order(s) marked as {new_status}.')
    action.short_description = label
    action.__name__ = f'mark_{new_status.lower()}'
    return action


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'cluster', 'colored_status', 'payment_status', 'total_amount', 'created_at']
    list_filter = ['status', 'payment_status', 'cluster', 'created_at']
    search_fields = ['user__name', 'user__email']
    inlines = [OrderItemInline]
    actions = [
        make_status_action('CONFIRMED', 'Mark as Confirmed'),
        make_status_action('PROCESSING', 'Mark as Processing'),
        make_status_action('IN_TRANSIT', 'Mark as In Transit'),
        make_status_action('DELIVERED', 'Mark as Delivered'),
        make_status_action('CANCELLED', 'Mark as Cancelled'),
    ]

    @admin.display(description='Status')
    def colored_status(self, obj):
        colors = {
            'PENDING': '#f59e0b',
            'AGGREGATING': '#3b82f6',
            'CONFIRMED': '#10b981',
            'PROCESSING': '#8b5cf6',
            'READY': '#6366f1',
            'IN_TRANSIT': '#f97316',
            'DELIVERED': '#059669',
            'CANCELLED': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="color:{}; font-weight:bold;">{}</span>',
            color, obj.get_status_display()
        )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'vendor', 'quantity', 'unit_price', 'subtotal']
    list_filter = ['vendor', 'created_at']
    search_fields = ['product__name', 'order__user__name']
