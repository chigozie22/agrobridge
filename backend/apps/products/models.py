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


class Combo(models.Model):
    """
    Pre-packaged food bundles with multiple items
    """
    USE_CASE_CHOICES = [
        ('students', 'Students'),
        ('families', 'Families'),
        ('shared', 'Shared/Hostel'),
        ('events', 'Events'),
    ]
    
    BADGE_CHOICES = [
        ('popular', 'Most Popular'),
        ('value', 'Best Value'),
        ('premium', 'Premium'),
        ('new', 'New'),
        ('limited', 'Limited Time'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(help_text="Short tagline for the combo")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Target audience
    feeds = models.CharField(max_length=100, help_text="e.g., '1 person', '4 people'")
    duration = models.CharField(max_length=100, help_text="e.g., '2 weeks', '1 month'")
    meals_count = models.IntegerField(help_text="Approximate number of meals")
    use_case = models.CharField(max_length=20, choices=USE_CASE_CHOICES, default='students')
    
    # Marketing
    badge = models.CharField(max_length=20, choices=BADGE_CHOICES, blank=True, null=True)
    image = models.ImageField(upload_to='combos/', blank=True, null=True)
    
    # Visibility
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show on featured combos section")
    featured_order = models.IntegerField(default=0, help_text="Order in featured section (lower = first)")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price']
        verbose_name = 'Food Combo'
        verbose_name_plural = 'Food Combos'
    
    def __str__(self):
        return f"{self.name} - ₦{self.price:,.0f}"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def cost_per_meal(self):
        """Calculate cost per meal"""
        if self.meals_count > 0:
            return self.price / self.meals_count
        return 0
    
    @property
    def savings_estimate(self):
        """Estimate savings vs individual buying (rough 20-30%)"""
        return self.price * 0.25  # 25% average savings
    
    @property
    def item_count(self):
        """Count of unique items in combo"""
        return self.items.count()


class ComboItem(models.Model):
    """
    Individual items within a combo package
    """
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='combo_items')
    
    # Quantity (flexible text format since combos use various measurements)
    quantity_text = models.CharField(
        max_length=100, 
        help_text="e.g., '5 cups', 'half pint', '1 pack', '2 sachets'"
    )
    
    # Optional: Numeric quantity for calculations
    quantity_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True,
        help_text="Numeric value for calculations (optional)"
    )
    
    quantity_unit = models.CharField(
        max_length=50, 
        blank=True,
        help_text="Unit: cups, kg, packs, liters, etc."
    )
    
    # Optional notes
    notes = models.CharField(
        max_length=200, 
        blank=True,
        help_text="e.g., 'for breakfast', 'for rice & stew'"
    )
    
    order = models.IntegerField(default=0, help_text="Display order in combo")
    
    class Meta:
        ordering = ['order', 'product__name']
        verbose_name = 'Combo Item'
        verbose_name_plural = 'Combo Items'
    
    def __str__(self):
        return f"{self.quantity_text} {self.product.name}"


class ComboMealSuggestion(models.Model):
    """
    Meal ideas/recipes users can cook with a combo
    """
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE, related_name='meal_suggestions')
    meal_name = models.CharField(max_length=200, help_text="e.g., 'Jollof Rice', 'Beans Porridge'")
    frequency = models.CharField(
        max_length=100, 
        help_text="e.g., '4-5 times', '10+ servings'"
    )
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Meal Suggestion'
        verbose_name_plural = 'Meal Suggestions'
    
    def __str__(self):
        return f"{self.meal_name} ({self.frequency})"