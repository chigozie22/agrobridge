from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .models import EggDeliveryBooking, CRATE_PRICE
from .serializers import EggBookingSerializer


class EggBookingCreateView(generics.CreateAPIView):
    """POST /api/poultry/bookings/ — anyone can place a booking."""
    serializer_class = EggBookingSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response({
            'message': 'Booking received! We will confirm your order within 2 hours.',
            'booking_id': booking.id,
            'booking': EggBookingSerializer(booking).data,
        }, status=status.HTTP_201_CREATED)


class EggBookingListView(generics.ListAPIView):
    """GET /api/poultry/bookings/ — admin only."""
    serializer_class = EggBookingSerializer
    permission_classes = [IsAdminUser]
    queryset = EggDeliveryBooking.objects.select_related('cluster').all()


class PoultryCrateInfoView(generics.GenericAPIView):
    """GET /api/poultry/info/ — public pricing info."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'price_per_crate': str(CRATE_PRICE),
            'currency': 'NGN',
            'unit': 'crate (30 eggs)',
            'service': 'AJFreshFarmFoods Poultry Services',
            'description': 'Door-to-door fresh egg delivery within Owerri clusters',
        })
