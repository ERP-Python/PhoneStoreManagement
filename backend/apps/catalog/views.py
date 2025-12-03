from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
import os
from django.conf import settings

from .models import Brand, Product, ProductVariant, ProductImage, Imei
from .serializers import (
    BrandSerializer, ProductSerializer, ProductVariantSerializer,
    ProductImageSerializer, ImeiSerializer
)
from config.pagination import StandardResultsSetPagination


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
    
    def perform_create(self, serializer):
        """Handle brand creation"""
        serializer.save()
    
    def perform_update(self, serializer):
        """Handle brand update"""
        serializer.save()
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_logo(self, request, pk=None):
        """Upload logo for a brand - support jpg and svg"""
        brand = self.get_object()
        
        # Get uploaded file
        logo = request.FILES.get('logo')
        
        if not logo:
            return Response(
                {'error': 'No logo provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Determine file extension
        file_name = logo.name.lower()
        if file_name.endswith('.svg'):
            file_ext = 'svg'
        elif file_name.endswith(('.jpg', '.jpeg')):
            file_ext = 'jpg'
        else:
            return Response(
                {'error': 'Only JPG and SVG files are supported'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create directory structure: brands/{brand_id}/
        upload_path = os.path.join(
            settings.BASE_DIR,
            'apps', 'assets', 'images', 'brands',
            str(brand.id)
        )
        
        # Create directories if they don't exist
        os.makedirs(upload_path, exist_ok=True)
        
        # Remove old logo files (both jpg and svg) before saving new one
        for ext in ['jpg', 'svg']:
            old_file = os.path.join(upload_path, f'1.{ext}')
            if os.path.exists(old_file):
                os.remove(old_file)
        
        # Save logo as 1.jpg or 1.svg
        file_path = os.path.join(upload_path, f'1.{file_ext}')
        
        # Save the file
        with open(file_path, 'wb+') as destination:
            for chunk in logo.chunks():
                destination.write(chunk)
        
        logo_url = f'/assets/images/brands/{brand.id}/1.{file_ext}'
        
        return Response({
            'message': 'Logo uploaded successfully',
            'logo': logo_url
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'])
    def delete_logo(self, request, pk=None):
        """Delete logo for a brand - support both jpg and svg"""
        brand = self.get_object()
        
        deleted = False
        # Try to delete both jpg and svg
        for ext in ['jpg', 'svg']:
            file_path = os.path.join(
                settings.BASE_DIR,
                'apps', 'assets', 'images', 'brands',
                str(brand.id),
                f'1.{ext}'
            )
            
            if os.path.exists(file_path):
                os.remove(file_path)
                deleted = True
        
        if deleted:
            return Response(
                {'message': 'Logo deleted successfully'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Logo not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('brand').prefetch_related('variants', 'images')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
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
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_images(self, request, pk=None):
        """Upload multiple images for a product variant"""
        variant = self.get_object()
        
        # Get uploaded files
        images = request.FILES.getlist('images')
        
        if not images:
            return Response(
                {'error': 'No images provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create directory structure: products/{product_id}/{variant_id}/
        product_id = variant.product.id
        variant_id = variant.id
        
        upload_path = os.path.join(
            settings.BASE_DIR,
            'apps', 'assets', 'images', 'products',
            str(product_id),
            str(variant_id)
        )
        
        # Create directories if they don't exist
        os.makedirs(upload_path, exist_ok=True)
        
        # Find next available number for images
        existing_files = [f for f in os.listdir(upload_path) if f.endswith('.jpg')] if os.path.exists(upload_path) else []
        existing_numbers = []
        for f in existing_files:
            try:
                num = int(f.split('.')[0])
                existing_numbers.append(num)
            except ValueError:
                continue
        
        next_number = max(existing_numbers) + 1 if existing_numbers else 1
        
        # Save images with sequential numbering
        saved_images = []
        for idx, image in enumerate(images):
            file_number = next_number + idx
            file_path = os.path.join(upload_path, f'{file_number}.jpg')
            
            # Save the file
            with open(file_path, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
            
            saved_images.append({
                'id': f"{product_id}_{variant_id}_{file_number}",
                'image': f'/assets/images/products/{product_id}/{variant_id}/{file_number}.jpg',
                'is_primary': file_number == 1,
                'sort_order': file_number
            })
        
        return Response({
            'message': f'Successfully uploaded {len(saved_images)} images',
            'images': saved_images
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """Delete a specific image for a product variant"""
        variant = self.get_object()
        image_number = request.data.get('image_number')
        
        if not image_number:
            return Response(
                {'error': 'image_number is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Construct file path
        product_id = variant.product.id
        variant_id = variant.id
        
        file_path = os.path.join(
            settings.BASE_DIR,
            'apps', 'assets', 'images', 'products',
            str(product_id),
            str(variant_id),
            f'{image_number}.jpg'
        )
        
        # Delete the file if it exists
        if os.path.exists(file_path):
            os.remove(file_path)
            return Response(
                {'message': 'Image deleted successfully'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Image not found'},
                status=status.HTTP_404_NOT_FOUND
            )


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