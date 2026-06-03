"""
Order models for AgroBridge
"""
from django.db import models
from apps.users.models import User
from apps.clusters.models import Cluster
from apps.products.models import Product, Combo
from apps.vendors.models import Vendor


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('AGGREGATING', 'Aggregating'),
        ('CONFIRMED', 'Confirmed'),
        ('PROCESSING', 'Processing'),
        ('READY', 'Ready for Delivery'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('UNPAID', 'Unpaid'),
        ('PENDING', 'Payment Pending'),
        ('SUCCESS', 'Paid'),
        ('FAILED', 'Payment Failed'),
    ]

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    cluster = models.ForeignKey(Cluster, on_delete=models.SET_NULL, null=True, related_name='orders')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Delivery info
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=20)
    delivery_notes = models.TextField(blank=True)

    # Paystack payment
    payment_reference = models.CharField(max_length=100, blank=True, unique=True, null=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='UNPAID')
    paid_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['cluster']),
            models.Index(fields=['status']),
            models.Index(fields=['payment_reference']),
        ]

    def __str__(self):
        return f"Order #{self.id} - {self.user.name} - {self.status}"

    @property
    def items_total(self):
        return sum(item.subtotal for item in self.items.all())


class OrderItem(models.Model):
    """One line in an order — either a product or a combo package."""

    id = models.BigAutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')

    # Exactly one of product / combo will be set
    product = models.ForeignKey(Product, on_delete=models.PROTECT, null=True, blank=True, related_name='order_items')
    combo = models.ForeignKey(Combo, on_delete=models.PROTECT, null=True, blank=True, related_name='order_items')
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')

    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        name = self.combo.name if self.combo else (self.product.name if self.product else '?')
        return f"{name} x{self.quantity} — Order #{self.order_id}"

    def save(self, *args, **kwargs):
        self.subtotal = self.quantity * self.unit_price
        super().save(*args, **kwargs)
