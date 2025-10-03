from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Brand, Product, ProductVariant, ProductImage, Imei
from .serializers import (
    BrandSerializer, ProductSerializer, ProductVariantSerializer,
    ProductImageSerializer, ImeiSerializer
)


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug']
    ordering_fields = ['name', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('brand').prefetch_related('variants', 'images')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'barcode']
    ordering_fields = ['name', 'created_at', 'sku']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by brand
        brand = self.request.query_params.get('brand', None)
        if brand:
            queryset = queryset.filter(brand_id=brand)
        
        # Filter by is_active
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by in_stock
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock == '1':
            from apps.inventory.models import Inventory
            variant_ids_in_stock = Inventory.objects.filter(on_hand__gt=0).values_list('product_variant_id', flat=True)
            queryset = queryset.filter(variants__id__in=variant_ids_in_stock).distinct()
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all().select_related('product', 'product__brand')
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['sku', 'product__name']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by product
        product = self.request.query_params.get('product', None)
        if product:
            queryset = queryset.filter(product_id=product)
        
        # Filter by is_active
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        product = self.request.query_params.get('product', None)
        if product:
            queryset = queryset.filter(product_id=product)
        return queryset 