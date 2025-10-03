from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import OrderViewSet, StockOutViewSet

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')
router.register(r'stock-outs', StockOutViewSet, basename='stockout')

urlpatterns = router.urls 