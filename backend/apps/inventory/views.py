from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, F

from .models import Inventory, StockMovement
from .serializers import InventorySerializer, StockMovementSerializer


class InventoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Inventory management (Read-only)
    Inventory is automatically updated via Stock In/Out
    """
    queryset = Inventory.objects.all().select_related(
        'product_variant__product__brand'
    )
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product_variant__product__name', 'product_variant__sku']
    ordering_fields = ['on_hand', 'updated_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by product
        product = self.request.query_params.get('product', None)
        if product:
            queryset = queryset.filter(product_variant__product_id=product)
        
        # Filter by brand
        brand = self.request.query_params.get('brand', None)
        if brand:
            queryset = queryset.filter(product_variant__product__brand_id=brand)
        
        # Filter by low stock
        low_stock = self.request.query_params.get('low_stock', None)
        if low_stock:
            threshold = int(low_stock)
            queryset = queryset.filter(on_hand__lte=threshold)
        
        # Filter by out of stock
        out_of_stock = self.request.query_params.get('out_of_stock', None)
        if out_of_stock == 'true':
            queryset = queryset.filter(on_hand=0)
        
        # Filter by in stock
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock == 'true':
            queryset = queryset.filter(on_hand__gt=0)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def low_stock_alert(self, request):
        """Get inventory items with low stock"""
        threshold = int(request.query_params.get('threshold', 10))
        
        low_stock_items = self.get_queryset().filter(
            on_hand__lte=threshold,
            on_hand__gt=0
        ).order_by('on_hand')
        
        serializer = self.get_serializer(low_stock_items, many=True)
        return Response({
            'threshold': threshold,
            'count': low_stock_items.count(),
            'items': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """Get out of stock items"""
        out_of_stock_items = self.get_queryset().filter(on_hand=0)
        
        serializer = self.get_serializer(out_of_stock_items, many=True)
        return Response({
            'count': out_of_stock_items.count(),
            'items': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get inventory summary statistics"""
        queryset = self.get_queryset()
        
        total_items = queryset.count()
        total_stock = sum(item.on_hand for item in queryset)
        out_of_stock_count = queryset.filter(on_hand=0).count()
        low_stock_count = queryset.filter(on_hand__lte=10, on_hand__gt=0).count()
        
        return Response({
            'total_items': total_items,
            'total_stock': total_stock,
            'out_of_stock_count': out_of_stock_count,
            'low_stock_count': low_stock_count,
            'in_stock_count': total_items - out_of_stock_count
        })


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Stock Movement history (Read-only)
    Stock movements are automatically created via Stock In/Out
    """
    queryset = StockMovement.objects.all().select_related(
        'product_variant__product__brand'
    )
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['product_variant__product__name', 'product_variant__sku', 'ref_type']
    ordering_fields = ['created_at', 'qty']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by type
        movement_type = self.request.query_params.get('type', None)
        if movement_type:
            queryset = queryset.filter(type=movement_type.upper())
        
        # Filter by product variant
        variant = self.request.query_params.get('variant', None)
        if variant:
            queryset = queryset.filter(product_variant_id=variant)
        
        # Filter by product
        product = self.request.query_params.get('product', None)
        if product:
            queryset = queryset.filter(product_variant__product_id=product)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        # Filter by ref_type
        ref_type = self.request.query_params.get('ref_type', None)
        if ref_type:
            queryset = queryset.filter(ref_type=ref_type)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get stock movement summary"""
        queryset = self.get_queryset()
        
        total_in = sum(m.qty for m in queryset.filter(type='IN'))
        total_out = sum(m.qty for m in queryset.filter(type='OUT'))
        
        return Response({
            'total_movements': queryset.count(),
            'total_in': total_in,
            'total_out': total_out,
            'net_change': total_in - total_out
        }) 