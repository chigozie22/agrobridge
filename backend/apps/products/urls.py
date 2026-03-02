from django.urls import path
from .views import ProductViewSet

app_name = 'products'

urlpatterns = [
    path('', ProductViewSet.as_view({'get': 'list'}), name='product-list'),
    path('<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='product-detail'),
]