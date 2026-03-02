from django.contrib import admin
from .models import Cluster

@admin.register(Cluster)
class ClusterAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'status', 'total_users', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'location']
