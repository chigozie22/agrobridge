from django.urls import path
from .views import ForecastView

urlpatterns = [
    path('demand/', ForecastView.as_view(), name='forecast-demand'),
]
