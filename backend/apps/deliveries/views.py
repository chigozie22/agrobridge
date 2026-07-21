from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from django.utils import timezone
from .models import Delivery
from .serializers import DeliverySerializer
from apps.orders.models import Order


class IsAdminOrCourier(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('ADMIN', 'COURIER'))


class DeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Delivery.objects.select_related('cluster', 'courier')

        # Couriers see their own deliveries; buyers see their cluster's deliveries; admins see all
        if user.role == 'COURIER':
            qs = qs.filter(courier=user)
        elif user.role not in ('ADMIN', 'VENDOR'):
            if user.cluster_id:
                qs = qs.filter(cluster=user.cluster_id)
            else:
                qs = qs.none()

        # Optional query filters
        cluster_id = self.request.query_params.get('cluster')
        if cluster_id:
            qs = qs.filter(cluster_id=cluster_id)

        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        return qs

    def get_permissions(self):
        # Only admins and couriers can create/update/delete deliveries
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsAdminOrCourier()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        """Return the next scheduled delivery for the requesting user's cluster."""
        user = request.user
        if not user.cluster_id:
            return Response({'detail': 'You are not assigned to a cluster.'}, status=status.HTTP_200_OK)

        delivery = Delivery.objects.filter(
            cluster=user.cluster_id,
            status='SCHEDULED',
            scheduled_date__gte=timezone.now().date(),
        ).order_by('scheduled_date', 'scheduled_time').first()

        if not delivery:
            return Response({'detail': 'No upcoming delivery scheduled for your cluster.'}, status=status.HTTP_200_OK)

        return Response(DeliverySerializer(delivery).data)

    @action(detail=True, methods=['post'], url_path='complete')
    def complete(self, request, pk=None):
        """Mark a delivery as completed and update all IN_TRANSIT orders in the cluster to DELIVERED."""
        user = request.user
        if user.role not in ('ADMIN', 'COURIER'):
            return Response({'error': 'Only admins and couriers can complete deliveries.'}, status=status.HTTP_403_FORBIDDEN)

        delivery = self.get_object()
        if delivery.status == 'COMPLETED':
            return Response({'error': 'This delivery is already completed.'}, status=status.HTTP_400_BAD_REQUEST)

        delivery.status = 'COMPLETED'
        delivery.completed_at = timezone.now()
        delivery.save()

        # Mark all IN_TRANSIT orders for this cluster as DELIVERED
        updated = Order.objects.filter(
            cluster=delivery.cluster,
            status='IN_TRANSIT',
        ).update(status='DELIVERED')

        return Response({
            'message': f'Delivery completed. {updated} order(s) marked as delivered.',
            'delivery': DeliverySerializer(delivery).data,
        })
