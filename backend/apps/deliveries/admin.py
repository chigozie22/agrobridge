from django.contrib import admin
from .models import Delivery

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ['id', 'cluster', 'courier', 'status', 'scheduled_date', 'scheduled_time']
    list_filter = ['status', 'cluster', 'scheduled_date']
    search_fields = ['cluster__name', 'courier__name']
