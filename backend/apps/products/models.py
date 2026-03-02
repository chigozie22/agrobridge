"""
Product models for AgroBridge
"""
from django.db import models


class Category(models.Model):
    """Product categories"""
    
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Represents a food product"""
    
    UNIT_CHOICES = [
        ('KG', 'Kilogram'),
        ('G', 'Gram'),
        ('L', 'Liter'),
        ('ML', 'Milliliter'),
        ('PIECE', 'Piece'),
        ('BAG', 'Bag'),
        ('BASKET', 'Basket'),
        ('CRATE', 'Crate'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='products'
    )
    
    # Product specifications
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='KG')
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    
    # Quality and preservation
    requires_refrigeration = models.BooleanField(default=False)
    shelf_life_days = models.IntegerField(null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.unit})"
    
    def get_cheapest_price(self):
        """Get the cheapest current price for this product"""
        from apps.vendors.models import VendorPrice
        cheapest = VendorPrice.objects.filter(
            product=self,
            is_available=True
        ).order_by('price').first()
        return cheapest.price if cheapest else None
