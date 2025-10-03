from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, F, Sum, Count
from django.db.models.functions import Coalesce

from .models import Inventory, StockMovement
from .serializers import InventorySerializer, StockMovementSerializer
from apps.catalog.models import Product


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
    def by_product(self, request):
        """
        Get inventory grouped by product (not variant)
        Each row shows total inventory across all variants of a product
        """
        from apps.sales.models import OrderItem
        
        # Get search term
        search = request.query_params.get('search', '')
        
        # Get all products with active variants
        products_query = Product.objects.filter(
            is_active=True,
            variants__is_active=True,
            variants__inventory__isnull=False
        ).select_related('brand').distinct()
        
        # Apply search filter
        if search:
            products_query = products_query.filter(
                Q(name__icontains=search) |
                Q(sku__icontains=search) |
                Q(brand__name__icontains=search)
            )
        
        # Paginate
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        total_count = products_query.count()
        start = (page - 1) * page_size
        end = start + page_size
        
        products = products_query[start:end]
        
        # Build response data
        result_data = []
        low_stock_threshold = 10
        
        for product in products:
            # Get all variants with inventory
            variants = product.variants.filter(
                is_active=True,
                inventory__isnull=False
            ).select_related('inventory')
            
            # Calculate totals
            total_on_hand = 0
            total_reserved = 0
            variants_data = []
            
            for variant in variants:
                inventory = variant.inventory
                
                # Calculate reserved quantity
                reserved = OrderItem.objects.filter(
                    product_variant=variant,
                    order__status='pending'
                ).aggregate(total=Sum('qty'))['total'] or 0
                
                total_on_hand += inventory.on_hand
                total_reserved += reserved
                
                # Build variant detail
                variant_parts = []
                if variant.ram:
                    variant_parts.append(variant.ram)
                if variant.rom:
                    variant_parts.append(variant.rom)
                if variant.color:
                    variant_parts.append(variant.color)
                
                variants_data.append({
                    'id': variant.id,
                    'sku': variant.sku,
                    'display': ' / '.join(variant_parts) if variant_parts else '-',
                    'ram': variant.ram or '',
                    'rom': variant.rom or '',
                    'color': variant.color or '',
                    'price': float(variant.price),
                    'on_hand': inventory.on_hand,
                    'reserved': reserved,
                    'available': max(0, inventory.on_hand - reserved)
                })
            
            total_available = max(0, total_on_hand - total_reserved)
            
            # Determine status
            if total_on_hand == 0:
                status_data = {
                    'value': 'out_of_stock',
                    'label': 'Hết hàng',
                    'color': 'error'
                }
            elif total_on_hand <= low_stock_threshold:
                status_data = {
                    'value': 'low_stock',
                    'label': 'Sắp hết',
                    'color': 'warning'
                }
            else:
                status_data = {
                    'value': 'in_stock',
                    'label': 'Còn hàng',
                    'color': 'success'
                }
            
            result_data.append({
                'id': product.id,
                'name': product.name,
                'sku': product.sku,
                'brand_name': product.brand.name if product.brand else '',
                'total_on_hand': total_on_hand,
                'total_reserved': total_reserved,
                'total_available': total_available,
                'variants_count': variants.count(),
                'variants': variants_data,
                'status': status_data
            })
        
        return Response({
            'count': total_count,
            'page': page,
            'page_size': page_size,
            'results': result_data
        })
    
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
