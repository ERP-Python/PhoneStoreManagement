from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone

from .models import Supplier, PurchaseOrder, StockIn
from .serializers import (
    SupplierSerializer, PurchaseOrderSerializer, StockInSerializer
)


class SupplierViewSet(viewsets.ModelViewSet):
    """ViewSet for Supplier management"""
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'contact', 'phone', 'email']
    ordering_fields = ['name', 'created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by is_active
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Purchase Order management"""
    queryset = PurchaseOrder.objects.all().select_related(
        'supplier', 'created_by', 'approved_by'
    ).prefetch_related('items__product_variant__product__brand')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'supplier__name']
    ordering_fields = ['created_at', 'code']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by supplier
        supplier = self.request.query_params.get('supplier', None)
        if supplier:
            queryset = queryset.filter(supplier_id=supplier)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a purchase order"""
        purchase_order = self.get_object()
        
        if purchase_order.status != 'draft':
            return Response(
                {'error': 'Only draft purchase orders can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        purchase_order.status = 'approved'
        purchase_order.approved_by = request.user
        purchase_order.approved_at = timezone.now()
        purchase_order.save()
        
        serializer = self.get_serializer(purchase_order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a purchase order"""
        purchase_order = self.get_object()
        
        if purchase_order.status == 'cancelled':
            return Response(
                {'error': 'Purchase order is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        purchase_order.status = 'cancelled'
        purchase_order.save()
        
        serializer = self.get_serializer(purchase_order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def create_stock_in(self, request, pk=None):
        """Create Stock In from Purchase Order"""
        purchase_order = self.get_object()
        
        if purchase_order.status != 'approved':
            return Response(
                {'error': 'Purchase order must be approved first'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Prepare Stock In data
        stock_in_data = {
            'source': 'PO',
            'reference_id': purchase_order.id,
            'note': f'Stock In from PO {purchase_order.code}',
            'items': []
        }
        
        # Copy items from PO
        for po_item in purchase_order.items.all():
            stock_in_data['items'].append({
                'product_variant': po_item.product_variant.id,
                'qty': po_item.qty,
                'unit_cost': po_item.unit_cost
            })
        
        # Create Stock In
        stock_in_serializer = StockInSerializer(
            data=stock_in_data,
            context={'request': request}
        )
        
        if stock_in_serializer.is_valid():
            stock_in = stock_in_serializer.save(created_by=request.user)
            return Response(stock_in_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(stock_in_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StockInViewSet(viewsets.ModelViewSet):
    """ViewSet for Stock In management"""
    queryset = StockIn.objects.all().select_related('created_by').prefetch_related(
        'items__product_variant__product__brand'
    )
    serializer_class = StockInSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'note']
    ordering_fields = ['created_at', 'code']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by source
        source = self.request.query_params.get('source', None)
        if source:
            queryset = queryset.filter(source=source)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user) 