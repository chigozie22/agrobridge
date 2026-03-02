from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Vendor, VendorPrice
from .serializers import VendorSerializer, VendorPriceSerializer

class VendorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Vendor.objects.filter(is_active=True)
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]

class VendorPriceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VendorPrice.objects.filter(is_available=True)
    serializer_class = VendorPriceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['vendor', 'product']
