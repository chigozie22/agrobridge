import uuid
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order
from .serializers import OrderCreateSerializer, OrderReadSerializer


class OrderViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product', 'items__combo')

    # POST /api/orders/
    def create(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderReadSerializer(order).data, status=status.HTTP_201_CREATED)

    # GET /api/orders/
    def list(self, request):
        orders = self.get_queryset()
        return Response(OrderReadSerializer(orders, many=True).data)

    # GET /api/orders/{id}/
    def retrieve(self, request, pk=None):
        order = self.get_queryset().filter(pk=pk).first()
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderReadSerializer(order).data)

    # POST /api/orders/{id}/initiate_payment/
    @action(detail=True, methods=['post'], url_path='initiate_payment')
    def initiate_payment(self, request, pk=None):
        order = self.get_queryset().filter(pk=pk).first()
        if not order:
            return Response({'error': 'Order not found'}, status=404)
        if order.payment_status == 'SUCCESS':
            return Response({'error': 'Order already paid'}, status=400)

        # Generate a unique reference
        reference = f"AGB-{order.id}-{uuid.uuid4().hex[:8].upper()}"
        order.payment_reference = reference
        order.payment_status = 'PENDING'
        order.save()

        payload = {
            'email': request.user.email or f"{request.user.phone}@agrobridge.ng",
            'amount': int(order.total_amount * 100),  # Paystack uses kobo
            'reference': reference,
            'callback_url': f"{settings.FRONTEND_URL}/orders/{order.id}?verify=1",
            'metadata': {
                'order_id': order.id,
                'user_id': request.user.id,
                'cluster': order.cluster.name if order.cluster else '',
            }
        }

        try:
            resp = requests.post(
                'https://api.paystack.co/transaction/initialize',
                json=payload,
                headers={'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}'},
                timeout=10,
            )
            data = resp.json()
            if data.get('status'):
                return Response({
                    'authorization_url': data['data']['authorization_url'],
                    'reference': reference,
                    'order_id': order.id,
                })
            return Response({'error': data.get('message', 'Paystack error')}, status=400)
        except requests.RequestException as e:
            return Response({'error': f'Could not reach Paystack: {str(e)}'}, status=503)

    # POST /api/orders/{id}/verify_payment/
    @action(detail=True, methods=['post'], url_path='verify_payment')
    def verify_payment(self, request, pk=None):
        order = self.get_queryset().filter(pk=pk).first()
        if not order:
            return Response({'error': 'Order not found'}, status=404)
        if not order.payment_reference:
            return Response({'error': 'No payment initiated for this order'}, status=400)

        try:
            resp = requests.get(
                f'https://api.paystack.co/transaction/verify/{order.payment_reference}',
                headers={'Authorization': f'Bearer {settings.PAYSTACK_SECRET_KEY}'},
                timeout=10,
            )
            data = resp.json()
            if data.get('status') and data['data']['status'] == 'success':
                order.payment_status = 'SUCCESS'
                order.status = 'CONFIRMED'
                order.paid_at = timezone.now()
                order.confirmed_at = timezone.now()
                order.save()
                return Response(OrderReadSerializer(order).data)
            else:
                order.payment_status = 'FAILED'
                order.save()
                return Response({'error': 'Payment not successful', 'order': OrderReadSerializer(order).data}, status=400)
        except requests.RequestException as e:
            return Response({'error': f'Could not reach Paystack: {str(e)}'}, status=503)

    # POST /api/orders/{id}/cancel/
    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        order = self.get_queryset().filter(pk=pk).first()
        if not order:
            return Response({'error': 'Order not found'}, status=404)
        if order.status not in ('PENDING', 'AGGREGATING'):
            return Response({'error': f'Cannot cancel an order in {order.status} status'}, status=400)
        if order.payment_status == 'SUCCESS':
            return Response({'error': 'Paid orders cannot be cancelled here — contact support'}, status=400)
        order.status = 'CANCELLED'
        order.save()
        return Response(OrderReadSerializer(order).data)
