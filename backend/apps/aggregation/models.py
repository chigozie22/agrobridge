"""
Aggregation models for AgroBridge - Core intelligence system
"""
from django.db import models
from django.core.validators import MinValueValidator
from apps.clusters.models import Cluster


class AggregationRun(models.Model):
    """
    Represents a single aggregation run for a cluster
    This is where the magic happens - combining orders and optimizing pricing
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('analyzing', 'Analyzing Orders'),
        ('optimizing', 'Optimizing Prices'),
        ('assigning', 'Assigning Vendors'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    # Identification
    run_number = models.CharField(max_length=50, unique=True, db_index=True)
    
    # Cluster
    cluster = models.ForeignKey(
        Cluster,
        on_delete=models.PROTECT,
        related_name='aggregation_runs'
    )
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Aggregation window
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Orders included
    total_orders = models.IntegerField(default=0)
    total_order_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00
    )
    
    # Optimization results
    total_savings = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Total savings achieved through aggregation"
    )
    average_savings_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Average percentage saved per order"
    )
    
    # Vendor assignment
    vendors_involved = models.IntegerField(default=0)
    
    # Delivery coordination
    estimated_delivery_date = models.DateField(null=True, blank=True)
    
    # Metadata
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'aggregation_runs'
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['cluster', 'status']),
            models.Index(fields=['-started_at']),
        ]
    
    def __str__(self):
        return f"Aggregation {self.run_number} - {self.cluster.name}"
    
    def generate_run_number(self):
        """Generate unique run number"""
        from django.utils import timezone
        import random
        import string
        
        date_str = timezone.now().strftime('%Y%m%d')
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"AGG{date_str}{random_str}"


class PriceOptimization(models.Model):
    """
    Records the price optimization decisions made during aggregation
    """
    
    aggregation_run = models.ForeignKey(
        AggregationRun,
        on_delete=models.CASCADE,
        related_name='price_optimizations'
    )
    
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.PROTECT,
        related_name='price_optimizations'
    )
    
    # Total demand for this product in this run
    total_quantity_needed = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    
    # Best vendor selected
    selected_vendor = models.ForeignKey(
        'vendors.Vendor',
        on_delete=models.PROTECT,
        related_name='price_wins'
    )
    
    # Pricing
    selected_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.00)]
    )
    market_average_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.00)],
        help_text="Average market price for comparison"
    )
    savings_per_unit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )
    total_savings = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
    )
    
    # Alternative vendors considered
    alternatives_evaluated = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'price_optimizations'
        ordering = ['-total_savings']
        unique_together = ['aggregation_run', 'product']
        indexes = [
            models.Index(fields=['aggregation_run', 'product']),
            models.Index(fields=['selected_vendor']),
        ]
    
    def __str__(self):
        return f"{self.product.name} - {self.selected_vendor.business_name}: ₦{self.selected_price}"
    
    def calculate_savings(self):
        """Calculate savings compared to market average"""
        self.savings_per_unit = self.market_average_price - self.selected_price
        self.total_savings = self.savings_per_unit * self.total_quantity_needed
        self.save(update_fields=['savings_per_unit', 'total_savings'])


class VendorAllocation(models.Model):
    """
    Tracks which vendors are allocated which orders in an aggregation run
    """
    
    aggregation_run = models.ForeignKey(
        AggregationRun,
        on_delete=models.CASCADE,
        related_name='vendor_allocations'
    )
    
    vendor = models.ForeignKey(
        'vendors.Vendor',
        on_delete=models.PROTECT,
        related_name='allocations'
    )
    
    # What the vendor needs to fulfill
    total_items = models.IntegerField(default=0)
    total_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00
    )
    
    # Vendor response
    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('partial', 'Partially Confirmed'),
        ('declined', 'Declined'),
    ]
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    confirmed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vendor_allocations'
        ordering = ['-total_value']
        unique_together = ['aggregation_run', 'vendor']
    
    def __str__(self):
        return f"{self.vendor.business_name} - Run {self.aggregation_run.run_number}: ₦{self.total_value}"
