from decimal import Decimal
from rest_framework import serializers
from apps.products.models import Product, Combo
from .models import Order, OrderItem


class OrderItemReadSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'name', 'type', 'quantity', 'unit_price', 'subtotal', 'notes']

    def get_name(self, obj):
        if obj.combo:
            return obj.combo.name
        return obj.product.name if obj.product else ''

    def get_type(self, obj):
        return 'combo' if obj.combo else 'product'


# ── Input shape from the frontend cart ──────────────────────────────────────
# Each cart item: { id: "combo-3" | "product-7", name, price, quantity, type }

class CartItemInputSerializer(serializers.Serializer):
    id = serializers.CharField()          # "combo-3" or "product-7"
    name = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    quantity = serializers.IntegerField(min_value=1)
    type = serializers.ChoiceField(choices=['combo', 'product'])


class OrderCreateSerializer(serializers.Serializer):
    delivery_address = serializers.CharField()
    delivery_phone = serializers.CharField()
    delivery_notes = serializers.CharField(required=False, allow_blank=True, default='')
    items = CartItemInputSerializer(many=True, min_length=1)

    def create(self, validated_data):
        user = self.context['request'].user
        cluster = user.cluster

        delivery_fee = Decimal(str(cluster.delivery_fee)) if cluster else Decimal('0')

        order = Order.objects.create(
            user=user,
            cluster=cluster,
            delivery_address=validated_data['delivery_address'],
            delivery_phone=validated_data['delivery_phone'],
            delivery_notes=validated_data.get('delivery_notes', ''),
            delivery_fee=delivery_fee,
            status='PENDING',
            payment_status='UNPAID',
        )

        items_total = Decimal('0')
        for item_data in validated_data['items']:
            raw_id = item_data['id']          # "combo-3" or "product-7"
            item_type = item_data['type']
            price = item_data['price']
            quantity = item_data['quantity']

            # Parse the numeric ID out of the prefixed string
            try:
                numeric_id = int(raw_id.split('-', 1)[1])
            except (IndexError, ValueError):
                numeric_id = None

            product_obj = None
            combo_obj = None

            if item_type == 'combo' and numeric_id:
                combo_obj = Combo.objects.filter(id=numeric_id).first()
            elif item_type == 'product' and numeric_id:
                product_obj = Product.objects.filter(id=numeric_id).first()

            order_item = OrderItem(
                order=order,
                product=product_obj,
                combo=combo_obj,
                quantity=quantity,
                unit_price=price,
                subtotal=price * quantity,
            )
            order_item.save()
            items_total += price * quantity

        order.total_amount = items_total + delivery_fee
        order.save()
        return order


class OrderReadSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)
    cluster_name = serializers.CharField(source='cluster.name', read_only=True, default='')
    user_name = serializers.CharField(source='user.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_name', 'cluster_name', 'status', 'status_display',
            'total_amount', 'delivery_fee', 'delivery_address', 'delivery_phone',
            'delivery_notes', 'payment_reference', 'payment_status',
            'payment_status_display', 'paid_at', 'items',
            'created_at', 'updated_at', 'confirmed_at', 'delivered_at',
        ]
