"""
AI Food Planner models for AgroBridge.

Every generated plan is logged (input + AI output) so it doubles as the
seed dataset for the real demand-forecasting engine down the line.
"""
from django.db import models
from apps.users.models import User


class PlanRequest(models.Model):
    """A single AI food-planning request and its generated result."""

    OCCASION_CHOICES = [
        ('FAMILY', 'Family Meal'),
        ('PARTY', 'Birthday / Party'),
        ('RESTAURANT', 'Restaurant Menu'),
        ('OTHER', 'Custom'),
    ]

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='plan_requests')

    occasion = models.CharField(max_length=20, choices=OCCASION_CHOICES)
    people_count = models.PositiveIntegerField()
    budget_naira = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    dietary_notes = models.TextField(blank=True)

    ai_response = models.JSONField(help_text="Full structured plan returned by the AI")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'plan_requests'
        verbose_name = 'Plan Request'
        verbose_name_plural = 'Plan Requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"Plan #{self.id} - {self.get_occasion_display()} for {self.people_count} - {self.user}"
