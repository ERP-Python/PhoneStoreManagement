from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views import ProductViewSet, ProductVariantViewSet, ProductImageViewSet

# Router for products
product_router = DefaultRouter()
product_router.register(r'', ProductViewSet, basename='product')

# Router for variants (separate to avoid conflicts)
variant_router = DefaultRouter()
variant_router.register(r'', ProductVariantViewSet, basename='product-variant')

# Router for images
image_router = DefaultRouter()
image_router.register(r'', ProductImageViewSet, basename='product-image')

urlpatterns = [
    path('variants/', include(variant_router.urls)),
    path('images/', include(image_router.urls)),
    path('', include(product_router.urls)),
] 