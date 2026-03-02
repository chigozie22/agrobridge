"""
Vendor models for AgroBridge
"""
from django.db import models
from apps.products.models import Product


class Vendor(models.Model):
    """Represents a food vendor/supplier"""
    
    VENDOR_TYPE_CHOICES = [
        ('FARMER', 'Farmer'),
        ('WHOLESALER', 'Wholesaler'),
        ('MARKET', 'Market Vendor'),
        ('COOPERATIVE', 'Cooperative'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    vendor_type = models.CharField(max_length=50, choices=VENDOR_TYPE_CHOICES)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField()
    
    # Trust and verification
    trust_score = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateField(null=True, blank=True)
    
    # Bank details
    bank_name = models.CharField(max_length=255, blank=True)
    account_number = models.CharField(max_length=20, blank=True)
    account_name = models.CharField(max_length=255, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vendors'
        verbose_name = 'Vendor'
        verbose_name_plural = 'Vendors'
        ordering = ['-trust_score', 'name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['trust_score']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.vendor_type})"


class VendorPrice(models.Model):
    """Current prices from vendors for products"""
    
    id = models.BigAutoField(primary_key=True)
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name='prices'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='vendor_prices'
    )
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    min_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    
    # Availability
    is_available = models.BooleanField(default=True)
    stock_quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'vendor_prices'
        verbose_name = 'Vendor Price'
        verbose_name_plural = 'Vendor Prices'
        unique_together = ['vendor', 'product']
        ordering = ['price']
        indexes = [
            models.Index(fields=['vendor', 'product']),
            models.Index(fields=['price']),
            models.Index(fields=['is_available']),
        ]
    
    def __str__(self):
        return f"{self.product.name} - {self.vendor.name}: ₦{self.price}"
