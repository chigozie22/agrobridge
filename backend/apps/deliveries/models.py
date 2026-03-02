"""
Delivery models for AgroBridge
"""
from django.db import models
from apps.orders.models import Order
from apps.users.models import User
from apps.clusters.models import Cluster


class Delivery(models.Model):
    """Represents a delivery coordination for aggregated orders"""
    
    STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    cluster = models.ForeignKey(
        Cluster,
        on_delete=models.CASCADE,
        related_name='deliveries'
    )
    courier = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'role': 'COURIER'},
        related_name='deliveries'
    )
    
    # Delivery details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    
    # Completion details
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'deliveries'
        verbose_name = 'Delivery'
        verbose_name_plural = 'Deliveries'
        ordering = ['-scheduled_date', '-scheduled_time']
    
    def __str__(self):
        return f"Delivery #{self.id} - {self.cluster.name} - {self.scheduled_date}"
