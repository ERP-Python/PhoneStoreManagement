from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import StockInViewSet

router = DefaultRouter()
router.register(r'', StockInViewSet, basename='stockin')

urlpatterns = router.urls 