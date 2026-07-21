from rest_framework import serializers

MAX_HISTORY_MESSAGES = 10


class ChatMessageSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['user', 'assistant'])
    content = serializers.CharField(max_length=2000)


class ChatRequestSerializer(serializers.Serializer):
    """Validates an incoming chat message. History is truncated server-side
    regardless of what the client sends, as defense-in-depth against an
    unbounded/expensive prompt."""

    message = serializers.CharField(max_length=500, allow_blank=False)
    history = ChatMessageSerializer(many=True, required=False, default=list)

    def validate_history(self, value):
        return value[-MAX_HISTORY_MESSAGES:]
