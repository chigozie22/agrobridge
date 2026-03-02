from django.urls import path
from .views import VendorViewSet

app_name = 'vendors'

urlpatterns = [
    path('', VendorViewSet.as_view({'get': 'list'}), name='vendor-list'),
    path('<int:pk>/', VendorViewSet.as_view({'get': 'retrieve'}), name='vendor-detail'),
]