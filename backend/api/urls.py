from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentDatasetViewSet

router = DefaultRouter()
router.register(r'datasets', EquipmentDatasetViewSet, basename='dataset')

urlpatterns = [
    path('', include(router.urls)),
]
