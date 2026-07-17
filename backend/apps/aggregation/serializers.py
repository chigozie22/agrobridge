from rest_framework import serializers
from .models import AggregationRun, PriceOptimization, VendorAllocation


class PriceOptimizationSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    vendor_name = serializers.CharField(source='selected_vendor.name', read_only=True)

    class Meta:
        model = PriceOptimization
        fields = [
            'id', 'product', 'product_name', 'total_quantity_needed',
            'selected_vendor', 'vendor_name', 'selected_price',
            'market_average_price', 'savings_per_unit', 'total_savings',
            'alternatives_evaluated',
        ]


class VendorAllocationSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = VendorAllocation
        fields = [
            'id', 'vendor', 'vendor_name', 'total_items', 'total_value',
            'status', 'status_display', 'confirmed_at', 'notes',
        ]


class AggregationRunListSerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = AggregationRun
        fields = [
            'id', 'run_number', 'cluster', 'cluster_name', 'status', 'status_display',
            'started_at', 'completed_at', 'total_orders', 'total_order_value',
            'total_savings', 'average_savings_percentage', 'vendors_involved',
        ]


class AggregationRunDetailSerializer(serializers.ModelSerializer):
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    price_optimizations = PriceOptimizationSerializer(many=True, read_only=True)
    vendor_allocations = VendorAllocationSerializer(many=True, read_only=True)

    class Meta:
        model = AggregationRun
        fields = [
            'id', 'run_number', 'cluster', 'cluster_name', 'status', 'status_display',
            'started_at', 'completed_at', 'total_orders', 'total_order_value',
            'total_savings', 'average_savings_percentage', 'vendors_involved',
            'estimated_delivery_date', 'notes',
            'price_optimizations', 'vendor_allocations',
        ]
