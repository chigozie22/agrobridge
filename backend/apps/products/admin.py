from django.contrib import admin
from .models import Category, Product, Combo, ComboItem, ComboMealSuggestion


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'created_at']
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'unit', 'is_active', 'requires_refrigeration', 'created_at']
    list_filter = ['category', 'is_active', 'unit', 'requires_refrigeration']
    search_fields = ['name', 'description']


class ComboItemInline(admin.TabularInline):
    model = ComboItem
    extra = 1
    fields = ['product', 'quantity_text', 'quantity_value', 'quantity_unit', 'notes', 'order']


class ComboMealSuggestionInline(admin.TabularInline):
    model = ComboMealSuggestion
    extra = 1
    fields = ['meal_name', 'frequency', 'order']


@admin.register(Combo)
class ComboAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'use_case', 'feeds', 'duration', 'badge', 'is_featured', 'is_active']
    list_filter = ['use_case', 'badge', 'is_featured', 'is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ComboItemInline, ComboMealSuggestionInline]
    list_editable = ['is_featured', 'is_active']
