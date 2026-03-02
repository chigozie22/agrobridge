from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ['subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    cluster_name = serializers.CharField(source='cluster.name', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'total_amount']
