from rest_framework import serializers
from .models import PlanRequest


class PlanRequestInputSerializer(serializers.Serializer):
    """Validates the incoming request to generate an AI food plan."""

    occasion = serializers.ChoiceField(choices=PlanRequest.OCCASION_CHOICES)
    people_count = serializers.IntegerField(min_value=1, max_value=1000)
    budget_naira = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=0, required=False, allow_null=True
    )
    dietary_notes = serializers.CharField(
        max_length=1000, required=False, allow_blank=True, default=''
    )


class PlanRequestSerializer(serializers.ModelSerializer):
    """Read-only representation of a saved plan request (e.g. for history views)."""

    occasion_display = serializers.CharField(source='get_occasion_display', read_only=True)

    class Meta:
        model = PlanRequest
        fields = [
            'id', 'occasion', 'occasion_display', 'people_count',
            'budget_naira', 'dietary_notes', 'ai_response', 'created_at',
        ]
        read_only_fields = fields
