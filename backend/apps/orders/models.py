"""
Order models for AgroBridge
"""
from django.db import models
from apps.users.models import User
from apps.clusters.models import Cluster
from apps.products.models import Product
from apps.vendors.models import Vendor


class Order(models.Model):
    """Represents a customer order"""
    
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
    
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    cluster = models.ForeignKey(
        Cluster,
        on_delete=models.SET_NULL,
        null=True,
        related_name='orders'
    )
    
    # Order details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Delivery information
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=20)
    delivery_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'orders'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['cluster']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.name} - {self.status}"
    
    def calculate_total(self):
        """Calculate total order amount"""
        items_total = sum(item.subtotal for item in self.items.all())
        self.total_amount = items_total + self.delivery_fee
        self.save()
        return self.total_amount


class OrderItem(models.Model):
    """Individual items in an order"""
    
    id = models.BigAutoField(primary_key=True)
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='order_items'
    )
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.SET_NULL,
        null=True,
        related_name='order_items'
    )
    
    # Quantities and pricing
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Notes
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'order_items'
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['product']),
            models.Index(fields=['vendor']),
        ]
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity} - Order #{self.order.id}"
    
    def save(self, *args, **kwargs):
        """Calculate subtotal before saving"""
        self.subtotal = self.quantity * self.unit_price
        super().save(*args, **kwargs)
