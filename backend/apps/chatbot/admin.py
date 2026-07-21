from django.contrib import admin
from .models import ChatLog


@admin.register(ChatLog)
class ChatLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'created_at']
    list_filter = ['created_at']
    search_fields = ['message', 'response', 'user__name', 'user__email']
    readonly_fields = ['user', 'message', 'response', 'created_at']
