from decimal import Decimal
from django.db import models


CRATE_PRICE = Decimal('5650.00')


class EggDeliveryBooking(models.Model):
    STATUS_CHOICES = [
        ('PENDING',          'Pending'),
        ('CONFIRMED',        'Confirmed'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED',        'Delivered'),
        ('CANCELLED',        'Cancelled'),
    ]

    # Customer details
    name  = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)

    # Delivery
    cluster          = models.ForeignKey(
        'clusters.Cluster',
        on_delete=models.SET_NULL,
        null=True,
        related_name='egg_bookings',
    )
    delivery_address = models.TextField()
    delivery_date    = models.DateField()

    # Order
    crates          = models.PositiveIntegerField()
    price_per_crate = models.DecimalField(max_digits=10, decimal_places=2, default=CRATE_PRICE)
    total_amount    = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    notes  = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Egg Delivery Booking'
        verbose_name_plural = 'Egg Delivery Bookings'

    def __str__(self):
        return f"#{self.pk} — {self.name} | {self.crates} crate(s) | {self.delivery_date}"

    def save(self, *args, **kwargs):
        self.total_amount = Decimal(str(self.crates)) * self.price_per_crate
        super().save(*args, **kwargs)
