from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Sum

from .models import Customer
from .serializers import CustomerSerializer, CustomerCreateSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    """ViewSet for Customer management"""
    queryset = Customer.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'phone', 'email']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CustomerCreateSerializer
        return CustomerSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by is_active
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Filter by has orders
        has_orders = self.request.query_params.get('has_orders', None)
        if has_orders == 'true':
            queryset = queryset.filter(orders__isnull=False).distinct()
        elif has_orders == 'false':
            queryset = queryset.filter(orders__isnull=True)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        """Get all orders for a customer"""
        customer = self.get_object()
        from apps.sales.models import Order
        from apps.sales.serializers import OrderSerializer
        
        orders = Order.objects.filter(customer=customer).order_by('-created_at')
        
        # Apply filters
        status_filter = request.query_params.get('status', None)
        if status_filter:
            orders = orders.filter(status=status_filter)
        
        serializer = OrderSerializer(orders, many=True)
        return Response({
            'customer_id': customer.id,
            'customer_name': customer.name,
            'orders_count': orders.count(),
            'orders': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get customer statistics"""
        customer = self.get_object()
        from apps.sales.models import Order
        
        orders = Order.objects.filter(customer=customer)
        paid_orders = orders.filter(status='paid')
        
        total_orders = orders.count()
        total_spent = sum(order.total for order in paid_orders)
        average_order_value = total_spent / total_orders if total_orders > 0 else 0
        
        return Response({
            'customer_id': customer.id,
            'customer_name': customer.name,
            'total_orders': total_orders,
            'paid_orders': paid_orders.count(),
            'pending_orders': orders.filter(status='pending').count(),
            'cancelled_orders': orders.filter(status='cancelled').count(),
            'total_spent': float(total_spent),
            'average_order_value': float(average_order_value),
            'last_order_date': orders.order_by('-created_at').first().created_at if orders.exists() else None
        })
    
    @action(detail=False, methods=['get'])
    def top_customers(self, request):
        """Get top customers by spending"""
        from apps.sales.models import Order
        
        limit = int(request.query_params.get('limit', 10))
        
        # Get customers with their total spending
        customers = Customer.objects.filter(
            orders__status='paid'
        ).annotate(
            total_spent=Sum('orders__total'),
            orders_count=Count('orders')
        ).order_by('-total_spent')[:limit]
        
        data = []
        for customer in customers:
            data.append({
                'id': customer.id,
                'name': customer.name,
                'phone': customer.phone,
                'email': customer.email,
                'total_spent': float(customer.total_spent) if customer.total_spent else 0,
                'orders_count': customer.orders_count
            })
        
        return Response({
            'count': len(data),
            'customers': data
        }) 