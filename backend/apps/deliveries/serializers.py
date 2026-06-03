from rest_framework import serializers
from django.utils import timezone
from .models import Delivery


class DeliverySerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    cluster_location = serializers.CharField(source='cluster.location', read_only=True)
    courier_name = serializers.CharField(source='courier.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_upcoming = serializers.SerializerMethodField()
    orders_count = serializers.SerializerMethodField()

    class Meta:
        model = Delivery
        fields = [
            'id', 'cluster', 'cluster_name', 'cluster_location',
            'courier', 'courier_name',
            'status', 'status_display',
            'scheduled_date', 'scheduled_time',
            'completed_at', 'notes',
            'is_upcoming', 'orders_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'completed_at', 'created_at', 'updated_at']

    def get_is_upcoming(self, obj):
        return obj.status == 'SCHEDULED' and obj.scheduled_date >= timezone.now().date()

    def get_orders_count(self, obj):
        return obj.cluster.orders.filter(
            status='IN_TRANSIT',
        ).count()
