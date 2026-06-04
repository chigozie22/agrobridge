from rest_framework import serializers
from django.utils import timezone
from .models import EggDeliveryBooking, CRATE_PRICE


class EggBookingSerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    price_per_crate = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = EggDeliveryBooking
        fields = [
            'id', 'name', 'phone', 'email',
            'cluster', 'cluster_name',
            'delivery_address', 'delivery_date',
            'crates', 'price_per_crate', 'total_amount',
            'notes', 'status', 'status_display',
            'created_at',
        ]
        read_only_fields = ['id', 'price_per_crate', 'total_amount', 'status', 'created_at']

    def validate_delivery_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError('Delivery date cannot be in the past.')
        return value

    def validate_crates(self, value):
        if value < 1:
            raise serializers.ValidationError('Minimum order is 1 crate.')
        if value > 100:
            raise serializers.ValidationError('For orders above 100 crates, please contact us directly.')
        return value
