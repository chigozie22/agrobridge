# from django.urls import path
# from .views import ProductViewSet

# app_name = 'products'

# urlpatterns = [
#     path('', ProductViewSet.as_view({'get': 'list'}), name='product-list'),
#     path('<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='product-detail'),
# ]

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('', ProductViewSet, basename='product')

urlpatterns = router.urls