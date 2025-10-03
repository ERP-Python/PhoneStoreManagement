from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InventoryViewSet, StockMovementViewSet

router = DefaultRouter()
router.register(r'', InventoryViewSet, basename='inventory')
router.register(r'movements', StockMovementViewSet, basename='stock-movement')

urlpatterns = router.urls 