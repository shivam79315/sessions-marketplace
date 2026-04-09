from django.urls import path
from .views import test_booking

urlpatterns = [
    path('', test_booking),
]