"""
Cluster models for AgroBridge
"""
from django.db import models


class Cluster(models.Model):
    """Represents a geographic buying cluster"""
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('PILOT', 'Pilot'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    location = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    
    # Geographic coordinates
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PILOT')
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Admin contact
    admin_phone = models.CharField(max_length=20, blank=True)
    admin_name = models.CharField(max_length=255, blank=True)
    
    class Meta:
        db_table = 'clusters'
        verbose_name = 'Cluster'
        verbose_name_plural = 'Clusters'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.location})"
    
    @property
    def total_users(self):
        """Get total number of users in this cluster"""
        return self.users.count()
    
    @property
    def active_users(self):
        """Get number of active users in this cluster"""
        return self.users.filter(is_active=True).count()
