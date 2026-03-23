from rest_framework import serializers
from .models import Product, Category
from apps.vendors.models import VendorPrice


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon']

class VendorPriceSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.name', read_only=True)
    vendor_type = serializers.CharField(source='vendor.get_vendor_type_display', read_only=True)
    
    class Meta:
        model = VendorPrice
        fields = ['id', 'vendor', 'vendor_name', 'vendor_type', 'price', 
                  'min_quantity', 'stock_quantity', 'is_available']

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    cheapest_price = serializers.SerializerMethodField()
    vendor_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'category_name', 'unit', 'image', 
                  'cheapest_price', 'vendor_count', 'is_active']
    
    def get_cheapest_price(self, obj):
        return obj.get_cheapest_price()
    
    def get_vendor_count(self, obj):
        return obj.vendor_prices.filter(is_available=True).count()

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    vendor_prices = VendorPriceSerializer(many=True, read_only=True)
    cheapest_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_cheapest_price(self, obj):
        return obj.get_cheapest_price()