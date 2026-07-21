"""
Quick Questions Chatbot models for AgroBridge.

Each exchange is logged individually (not full threads) so the founder
can see what people are actually asking — the conversation itself lives
only in the client's React state, never persisted server-side.
"""
from django.db import models
from apps.users.models import User


class ChatLog(models.Model):
    """A single question-and-answer exchange with the FAQ chatbot."""

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_logs',
    )

    message = models.TextField()
    response = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_logs'
        verbose_name = 'Chat Log'
        verbose_name_plural = 'Chat Logs'
        ordering = ['-created_at']

    def __str__(self):
        who = self.user.name if self.user else 'Anonymous'
        return f"{who}: {self.message[:50]}"
