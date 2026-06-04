from django.urls import path
from .views import EggBookingCreateView, EggBookingListView, PoultryCrateInfoView

urlpatterns = [
    path('bookings/', EggBookingCreateView.as_view(), name='egg-booking-create'),
    path('bookings/all/', EggBookingListView.as_view(), name='egg-booking-list'),
    path('info/', PoultryCrateInfoView.as_view(), name='poultry-info'),
]
