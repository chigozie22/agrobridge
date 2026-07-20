from rest_framework import serializers
from .models import Product, Category, Combo, ComboItem, ComboMealSuggestion
from apps.vendors.models import VendorPrice
from apps.pricing.services import calculate_price


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

class ClusterPricingMixin:
    """Shared cluster-aware tier pricing fields, computed once per object."""

    def _tier_pricing(self, obj):
        cluster = self.context.get('cluster')
        return calculate_price(obj, cluster)

    def get_cluster_price(self, obj):
        return self._tier_pricing(obj)['price']

    def get_current_cluster_quantity(self, obj):
        return self._tier_pricing(obj)['current_quantity']

    def get_tier_label(self, obj):
        return self._tier_pricing(obj)['tier_label']

    def get_next_tier_quantity(self, obj):
        return self._tier_pricing(obj)['next_tier_quantity']

    def get_next_tier_price(self, obj):
        return self._tier_pricing(obj)['next_tier_price']


class ProductListSerializer(ClusterPricingMixin, serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    cheapest_price = serializers.SerializerMethodField()
    vendor_count = serializers.SerializerMethodField()
    cluster_price = serializers.SerializerMethodField()
    current_cluster_quantity = serializers.SerializerMethodField()
    tier_label = serializers.SerializerMethodField()
    next_tier_quantity = serializers.SerializerMethodField()
    next_tier_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'category_name', 'unit', 'image',
                  'cheapest_price', 'vendor_count', 'is_active',
                  'cluster_price', 'current_cluster_quantity', 'tier_label',
                  'next_tier_quantity', 'next_tier_price']

    def get_cheapest_price(self, obj):
        return obj.get_cheapest_price()

    def get_vendor_count(self, obj):
        return obj.vendor_prices.filter(is_available=True).count()

class ProductDetailSerializer(ClusterPricingMixin, serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    vendor_prices = VendorPriceSerializer(many=True, read_only=True)
    cheapest_price = serializers.SerializerMethodField()
    cluster_price = serializers.SerializerMethodField()
    current_cluster_quantity = serializers.SerializerMethodField()
    tier_label = serializers.SerializerMethodField()
    next_tier_quantity = serializers.SerializerMethodField()
    next_tier_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_cheapest_price(self, obj):
        return obj.get_cheapest_price()


class ComboMealSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComboMealSuggestion
        fields = ['id', 'meal_name', 'frequency', 'order']


class ComboItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.get_unit_display', read_only=True)

    class Meta:
        model = ComboItem
        fields = ['id', 'product', 'product_name', 'product_unit',
                  'quantity_text', 'quantity_value', 'quantity_unit', 'notes', 'order']


class ComboListSerializer(serializers.ModelSerializer):
    badge_display = serializers.CharField(source='get_badge_display', read_only=True)
    use_case_display = serializers.CharField(source='get_use_case_display', read_only=True)
    cost_per_meal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    savings_estimate = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Combo
        fields = [
            'id', 'name', 'slug', 'description', 'price',
            'feeds', 'duration', 'meals_count', 'use_case', 'use_case_display',
            'badge', 'badge_display', 'image', 'is_featured', 'featured_order',
            'cost_per_meal', 'savings_estimate', 'item_count',
        ]


class ComboDetailSerializer(serializers.ModelSerializer):
    badge_display = serializers.CharField(source='get_badge_display', read_only=True)
    use_case_display = serializers.CharField(source='get_use_case_display', read_only=True)
    cost_per_meal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    savings_estimate = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    items = ComboItemSerializer(many=True, read_only=True)
    meal_suggestions = ComboMealSuggestionSerializer(many=True, read_only=True)

    class Meta:
        model = Combo
        fields = [
            'id', 'name', 'slug', 'description', 'price',
            'feeds', 'duration', 'meals_count', 'use_case', 'use_case_display',
            'badge', 'badge_display', 'image', 'is_featured', 'featured_order',
            'cost_per_meal', 'savings_estimate', 'item_count',
            'items', 'meal_suggestions',
            'created_at', 'updated_at',
        ]