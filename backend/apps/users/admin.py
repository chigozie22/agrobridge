"""
Admin configuration for User model
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model"""
    
    list_display = ['phone', 'name', 'email', 'role', 'cluster', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'cluster', 'date_joined']
    search_fields = ['phone', 'name', 'email']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        ('Personal Info', {'fields': ('name', 'email', 'address', 'avatar')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Cluster', {'fields': ('cluster',)}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone', 'name', 'password1', 'password2', 'role', 'cluster'),
        }),
    )
    
    filter_horizontal = ('groups', 'user_permissions',)
