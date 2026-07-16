from django.contrib import admin
from .models import PlanRequest


@admin.register(PlanRequest)
class PlanRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'occasion', 'people_count', 'budget_naira', 'created_at']
    list_filter = ['occasion', 'created_at']
    search_fields = ['user__name', 'user__phone', 'dietary_notes']
    readonly_fields = ['ai_response', 'created_at']
