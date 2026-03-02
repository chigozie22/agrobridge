from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'created_at']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'unit', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'unit']
    search_fields = ['name', 'description']
