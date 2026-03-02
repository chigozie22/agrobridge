from django.urls import path
from .views import ClusterViewSet

app_name = 'clusters'

urlpatterns = [
    # Remove 'post': 'create' - it's read-only!
    path('', ClusterViewSet.as_view({'get': 'list'}), name='cluster-list'),
    path('<int:pk>/', ClusterViewSet.as_view({'get': 'retrieve'}), name='cluster-detail'),
]