from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Cluster
from .serializers import ClusterSerializer

class ClusterViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cluster.objects.filter(status='ACTIVE')
    serializer_class = ClusterSerializer
    permission_classes = [AllowAny]
