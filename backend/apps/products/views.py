from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Product, Category, Combo
from .serializers import (
    ProductListSerializer, ProductDetailSerializer, CategorySerializer,
    ComboListSerializer, ComboDetailSerializer,
)


class ProductViewSet(ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=False, methods=['get'], url_path='categories')
    def categories(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class ComboViewSet(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['use_case', 'badge', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'featured_order', 'created_at']
    ordering = ['price']
    lookup_field = 'slug'

    def get_queryset(self):
        return Combo.objects.filter(is_active=True).prefetch_related('items__product', 'meal_suggestions')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ComboDetailSerializer
        return ComboListSerializer

    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        combos = self.get_queryset().filter(is_featured=True).order_by('featured_order')
        serializer = ComboListSerializer(combos, many=True)
        return Response(serializer.data)