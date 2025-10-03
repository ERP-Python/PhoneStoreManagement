from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import PaymentViewSet, vnpay_return, vnpay_ipn, vnpay_config

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    # VNPay callback endpoints
    path('vnpay/return/', vnpay_return, name='vnpay-return'),
    path('vnpay/ipn/', vnpay_ipn, name='vnpay-ipn'),
    path('vnpay/config/', vnpay_config, name='vnpay-config'),
    
    # Payment management
    path('', include(router.urls)),
] 