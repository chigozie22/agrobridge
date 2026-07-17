from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from apps.clusters.models import Cluster
from .models import AggregationRun
from .serializers import AggregationRunListSerializer, AggregationRunDetailSerializer
from .services import AggregationEngine, NothingToAggregateError


class AggregationRunViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin-only: trigger and inspect cluster aggregation runs."""
    permission_classes = [IsAdminUser]
    queryset = AggregationRun.objects.select_related('cluster').prefetch_related(
        'price_optimizations__product', 'price_optimizations__selected_vendor',
        'vendor_allocations__vendor',
    )

    def get_serializer_class(self):
        if self.action == 'list':
            return AggregationRunListSerializer
        return AggregationRunDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        cluster_id = self.request.query_params.get('cluster')
        if cluster_id:
            qs = qs.filter(cluster_id=cluster_id)
        return qs

    # POST /api/aggregation/runs/trigger/  (admin only)
    @action(detail=False, methods=['post'], url_path='trigger')
    def trigger(self, request):
        cluster_id = request.data.get('cluster_id')
        if not cluster_id:
            return Response({'error': 'cluster_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        cluster = get_object_or_404(Cluster, pk=cluster_id)
        try:
            agg_run = AggregationEngine(cluster).run()
        except NothingToAggregateError as exc:
            return Response({'error': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(AggregationRunDetailSerializer(agg_run).data, status=status.HTTP_201_CREATED)

    # GET /api/aggregation/runs/{id}/savings/  (admin only)
    @action(detail=True, methods=['get'], url_path='savings')
    def savings(self, request, pk=None):
        agg_run = self.get_object()
        return Response({
            'run_number': agg_run.run_number,
            'cluster': agg_run.cluster.name,
            'total_orders': agg_run.total_orders,
            'total_order_value': agg_run.total_order_value,
            'total_savings': agg_run.total_savings,
            'average_savings_percentage': agg_run.average_savings_percentage,
            'vendors_involved': agg_run.vendors_involved,
        })
