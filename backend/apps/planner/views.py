"""
AI Food Planner — generates a recipe/prep plan + Naira budget from a short
description of what the user needs to feed (a family, a party, a restaurant
menu). v1 of the roadmap's "AI-powered demand prediction" engine: every
request is logged (see PlanRequest) as the seed dataset for the real
forecasting work later.
"""
import json
import logging

import anthropic
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle

from apps.products.models import Product, Combo
from .models import PlanRequest
from .serializers import PlanRequestInputSerializer

logger = logging.getLogger(__name__)

CLAUDE_MODEL = 'claude-sonnet-5'

# Maps our occasion choices onto the existing Combo.use_case taxonomy so we
# can pull real, relevant catalog items to ground the AI's price estimates.
OCCASION_TO_COMBO_USE_CASE = {
    'FAMILY': 'families',
    'PARTY': 'events',
}

PLAN_SCHEMA = {
    'type': 'object',
    'properties': {
        'plan_title': {'type': 'string'},
        'summary': {'type': 'string'},
        'people_count': {'type': 'integer'},
        'occasion': {'type': 'string'},
        'estimated_total_cost_naira': {'type': 'number'},
        'cost_per_person_naira': {'type': 'number'},
        'shopping_list': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'item': {'type': 'string'},
                    'quantity': {'type': 'string'},
                    'unit': {'type': 'string'},
                    'estimated_price_naira': {'type': 'number'},
                    'category': {'type': 'string'},
                },
                'required': ['item', 'quantity', 'unit', 'estimated_price_naira', 'category'],
                'additionalProperties': False,
            },
        },
        'recipes': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'dish_name': {'type': 'string'},
                    'description': {'type': 'string'},
                    'prep_time_minutes': {'type': 'integer'},
                    'cook_time_minutes': {'type': 'integer'},
                    'ingredients': {'type': 'array', 'items': {'type': 'string'}},
                    'steps': {'type': 'array', 'items': {'type': 'string'}},
                },
                'required': [
                    'dish_name', 'description', 'prep_time_minutes',
                    'cook_time_minutes', 'ingredients', 'steps',
                ],
                'additionalProperties': False,
            },
        },
        'cooking_tips': {'type': 'array', 'items': {'type': 'string'}},
        'budget_notes': {'type': 'string'},
    },
    'required': [
        'plan_title', 'summary', 'people_count', 'occasion',
        'estimated_total_cost_naira', 'cost_per_person_naira',
        'shopping_list', 'recipes', 'cooking_tips', 'budget_notes',
    ],
    'additionalProperties': False,
}

SYSTEM_PROMPT = """You are AgroBridge's AI food-planning engine, serving FUTO students and Owerri \
residents in Nigeria. Given a food-planning request, produce a complete, practical plan: a \
shopping list with realistic Naira prices, one or more recipes with clear step-by-step prep and \
cooking instructions suitable for a home kitchen or small kitchen, and useful cooking tips.

Ground every price and quantity in Nigerian market reality — local ingredient names (garri, \
egusi, ugu, palm oil, crayfish, etc. where relevant), Naira pricing, and quantities that scale \
correctly to the number of people. Where a sample of real AgroBridge catalog prices is provided, \
anchor your shopping list prices to those instead of inventing numbers. If a budget is given and \
the realistic cost exceeds it, say so plainly in budget_notes and suggest practical trade-offs \
(cheaper protein, smaller portions, fewer dishes) rather than silently ignoring the budget."""


def _build_catalog_context(occasion: str) -> str:
    """Sample real product/combo prices so the AI grounds its estimates in reality."""
    lines = []

    use_case = OCCASION_TO_COMBO_USE_CASE.get(occasion)
    combos = Combo.objects.filter(is_active=True)
    if use_case:
        combos = combos.filter(use_case=use_case)
    combos = combos.order_by('price')[:5]
    if combos:
        lines.append('Relevant AgroBridge combo packages (for reference pricing):')
        for combo in combos:
            lines.append(f"- {combo.name}: ₦{combo.price:,.0f}, feeds {combo.feeds}, {combo.meals_count} meals")

    products = Product.objects.filter(is_active=True).order_by('name')[:20]
    priced = []
    for product in products:
        price = product.get_cheapest_price()
        if price is not None:
            priced.append(f"- {product.name} ({product.get_unit_display()}): ₦{price:,.0f}")
    if priced:
        lines.append('\nSample AgroBridge product prices (per listed unit):')
        lines.extend(priced[:15])

    return '\n'.join(lines) if lines else 'No catalog pricing sample available — use realistic Owerri, Nigeria market prices.'


class PlannerRateThrottle(UserRateThrottle):
    scope = 'planner'


class PlannerViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    throttle_classes = [PlannerRateThrottle]

    @action(detail=False, methods=['post'], url_path='generate')
    def generate(self, request):
        input_serializer = PlanRequestInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        if not settings.CLAUDE_API_KEY:
            return Response(
                {'error': 'The AI planner is not configured yet. Please try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        occasion = data['occasion']
        people_count = data['people_count']
        budget_naira = data.get('budget_naira')
        dietary_notes = data.get('dietary_notes', '')

        catalog_context = _build_catalog_context(occasion)

        user_prompt_parts = [
            f"Occasion: {dict(PlanRequest.OCCASION_CHOICES)[occasion]}",
            f"Number of people to feed: {people_count}",
        ]
        if budget_naira:
            user_prompt_parts.append(f"Total budget: ₦{budget_naira:,.0f}")
        if dietary_notes:
            user_prompt_parts.append(f"Dietary notes / preferences: {dietary_notes}")
        user_prompt_parts.append(f"\n{catalog_context}")
        user_prompt = '\n'.join(user_prompt_parts)

        try:
            client = anthropic.Anthropic(api_key=settings.CLAUDE_API_KEY)
            response = client.messages.create(
                model=CLAUDE_MODEL,
                max_tokens=8000,
                thinking={'type': 'adaptive'},
                output_config={
                    'effort': 'high',
                    'format': {'type': 'json_schema', 'schema': PLAN_SCHEMA},
                },
                system=SYSTEM_PROMPT,
                messages=[{'role': 'user', 'content': user_prompt}],
            )
        except anthropic.APIError as exc:
            logger.exception('Claude API error while generating a food plan')
            return Response(
                {'error': 'Could not reach the AI planner right now. Please try again shortly.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        text_block = next((b for b in response.content if b.type == 'text'), None)
        if text_block is None:
            return Response(
                {'error': 'The AI planner returned an unexpected response. Please try again.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        try:
            plan = json.loads(text_block.text)
        except (json.JSONDecodeError, ValueError):
            logger.exception('Failed to parse AI planner JSON output')
            return Response(
                {'error': 'The AI planner returned an unexpected response. Please try again.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        PlanRequest.objects.create(
            user=request.user,
            occasion=occasion,
            people_count=people_count,
            budget_naira=budget_naira,
            dietary_notes=dietary_notes,
            ai_response=plan,
        )

        return Response(plan, status=status.HTTP_200_OK)
