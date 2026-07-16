from rest_framework.routers import SimpleRouter
from .views import PlannerViewSet

router = SimpleRouter()
router.register('', PlannerViewSet, basename='planner')

urlpatterns = router.urls
