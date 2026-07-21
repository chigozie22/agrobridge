"""
Quick Questions Chatbot — a lightweight FAQ assistant available to every
visitor, logged in or not. Deliberately simpler than the AI Planner: plain
text replies (no JSON schema), no extended thinking, small max_tokens —
this only needs to answer general "how does AgroBridge work" questions
fast and cheaply, not produce a structured multi-part plan.
"""
import logging

import anthropic
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.views import APIView

from .models import ChatLog
from .serializers import ChatRequestSerializer

logger = logging.getLogger(__name__)

CLAUDE_MODEL = 'claude-sonnet-5'
MAX_TOKENS = 500

SYSTEM_PROMPT = """You are AgroBridge's quick-questions assistant, helping FUTO students and \
Owerri residents in Nigeria understand the platform. Answer briefly, warmly, and accurately based \
only on what AgroBridge actually does today:

- Cluster group buying: users join a neighborhood buying cluster; orders from everyone in a \
cluster get batched together for bulk discounts.
- Aggregation Engine: batches a cluster's confirmed orders and matches each product to its \
cheapest available vendor, calculating real bulk savings.
- Pricing Tiers: a product's price automatically drops as more people in your cluster order it \
before the batch is processed — no code, no waiting, it just updates live.
- Smart Sourcing: when possible, AgroBridge prefers local farmers/vendors near your cluster to cut \
delivery/logistics cost, without ever hiding cheaper or better options elsewhere.
- AI Food Planner: a separate tool that generates a shopping list, recipes, and a Naira budget from \
a description like "feed a family of 7" or "birthday party for 100".
- Poultry Services: egg delivery bookings and poultry products.
- Checkout: payment via Paystack; each cluster has a minimum total order value (shown at checkout) \
before the cluster's batch can be processed.
- Products page: browse individual products, search by name, or choose pre-planned "Smart Food \
Bundles" (combos) for common needs.

Keep answers short (a few sentences, not an essay) and conversational. If asked something specific \
to a user's own account — like "where is my order" or "what did I pay" — say you can't look that up \
here and point them to the Orders page (or WhatsApp support for anything urgent) instead of \
guessing. If asked something totally unrelated to AgroBridge or food buying, politely redirect back \
to what you can help with."""


class ChatbotAnonThrottle(AnonRateThrottle):
    scope = 'chatbot_anon'


class ChatbotUserThrottle(UserRateThrottle):
    scope = 'chatbot_user'


class ChatView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ChatbotAnonThrottle, ChatbotUserThrottle]

    def post(self, request):
        input_serializer = ChatRequestSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        if not settings.CLAUDE_API_KEY:
            return Response(
                {'error': 'The chat assistant is not configured yet. Please try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        message = data['message']
        history = [{'role': m['role'], 'content': m['content']} for m in data['history']]

        try:
            client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)
            response = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=MAX_TOKENS,
                system=SYSTEM_PROMPT,
                messages=[*history, {'role': 'user', 'content': message}],
            )
        except anthropic.APIError:
            logger.exception('Claude API error while answering a chatbot question')
            return Response(
                {'error': 'Could not reach the chat assistant right now. Please try again shortly.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        text_block = next((b for b in response.content if b.type == 'text'), None)
        if text_block is None:
            return Response(
                {'error': 'The chat assistant returned an unexpected response. Please try again.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        answer = text_block.text

        ChatLog.objects.create(
            user=request.user if request.user.is_authenticated else None,
            message=message,
            response=answer,
        )

        return Response({'response': answer}, status=status.HTTP_200_OK)
