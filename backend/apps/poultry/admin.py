from django.contrib import admin
from django.utils.html import format_html
from .models import EggDeliveryBooking


def make_status_action(new_status, label):
    def action(modeladmin, request, queryset):
        updated = queryset.update(status=new_status)
        modeladmin.message_user(request, f'{updated} booking(s) marked as {new_status}.')
    action.short_description = label
    action.__name__ = f'mark_{new_status.lower()}'
    return action


@admin.register(EggDeliveryBooking)
class EggDeliveryBookingAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'phone', 'cluster', 'delivery_date',
        'crates', 'total_amount', 'colored_status', 'created_at',
    ]
    list_filter = ['status', 'cluster', 'delivery_date', 'created_at']
    search_fields = ['name', 'phone', 'email', 'delivery_address']
    ordering = ['-created_at']
    readonly_fields = ['price_per_crate', 'total_amount', 'created_at', 'updated_at']
    actions = [
        make_status_action('CONFIRMED', 'Mark as Confirmed'),
        make_status_action('OUT_FOR_DELIVERY', 'Mark as Out for Delivery'),
        make_status_action('DELIVERED', 'Mark as Delivered'),
        make_status_action('CANCELLED', 'Mark as Cancelled'),
    ]

    fieldsets = (
        ('Customer', {'fields': ('name', 'phone', 'email')}),
        ('Delivery', {'fields': ('cluster', 'delivery_address', 'delivery_date', 'notes')}),
        ('Order', {'fields': ('crates', 'price_per_crate', 'total_amount')}),
        ('Status', {'fields': ('status',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    @admin.display(description='Status')
    def colored_status(self, obj):
        colors = {
            'PENDING':          '#f59e0b',
            'CONFIRMED':        '#3b82f6',
            'OUT_FOR_DELIVERY': '#f97316',
            'DELIVERED':        '#10b981',
            'CANCELLED':        '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="color:{}; font-weight:bold;">{}</span>',
            color, obj.get_status_display()
        )
