from rest_framework.routers import SimpleRouter
from .views import AggregationRunViewSet

router = SimpleRouter()
router.register('runs', AggregationRunViewSet, basename='aggregation-run')

urlpatterns = router.urls
