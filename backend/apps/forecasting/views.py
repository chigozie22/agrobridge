from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.clusters.models import Cluster
from .services import forecast_cluster_demand

WEEKS_BACK = 8


class ForecastView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        cluster_id = request.query_params.get('cluster')
        if not cluster_id:
            return Response({'error': 'cluster query param is required'}, status=status.HTTP_400_BAD_REQUEST)

        cluster = Cluster.objects.filter(id=cluster_id).first()
        if not cluster:
            return Response({'error': 'Cluster not found'}, status=status.HTTP_404_NOT_FOUND)

        forecasts = forecast_cluster_demand(cluster, weeks_back=WEEKS_BACK)

        return Response({
            'cluster_id': cluster.id,
            'cluster_name': cluster.name,
            'weeks_analyzed': WEEKS_BACK,
            'product_count': len(forecasts),
            'forecasts': forecasts,
        })
