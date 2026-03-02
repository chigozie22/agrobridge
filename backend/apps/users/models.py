"""
User models for AgroBridge
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """Custom user manager"""
    
    def create_user(self, phone, password=None, **extra_fields):
        """Create and return a regular user"""
        if not phone:
            raise ValueError('Users must have a phone number')
        
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, phone, password=None, **extra_fields):
        """Create and return a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model for AgroBridge"""
    
    ROLE_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('VENDOR', 'Vendor'),
        ('COURIER', 'Courier'),
        ('ADMIN', 'Admin'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    email = models.EmailField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')
    
    # Cluster relationship
    cluster = models.ForeignKey(
        'clusters.Cluster',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )
    
    # Additional fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Profile fields
    address = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['role']),
            models.Index(fields=['cluster']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.phone})"
    
    @property
    def is_customer(self):
        return self.role == 'CUSTOMER'
    
    @property
    def is_vendor(self):
        return self.role == 'VENDOR'
    
    @property
    def is_courier(self):
        return self.role == 'COURIER'
