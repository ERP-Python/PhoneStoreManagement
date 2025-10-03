from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, F, Q
from django.utils import timezone
from datetime import timedelta

from apps.sales.models import Order, OrderItem
from apps.inventory.models import Inventory, StockMovement
from apps.catalog.models import Product, ProductVariant
from apps.customers.models import Customer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_report(request):
    """
    Sales report with revenue and order statistics
    Query params: range (day|week|month|custom), date_from, date_to
    """
    range_type = request.query_params.get('range', 'day')
    
    # Determine date range
    if range_type == 'day':
        start_date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    elif range_type == 'week':
        start_date = timezone.now() - timedelta(days=7)
    elif range_type == 'month':
        start_date = timezone.now() - timedelta(days=30)
    elif range_type == 'custom':
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if date_from:
            start_date = timezone.datetime.fromisoformat(date_from)
        else:
            start_date = timezone.now() - timedelta(days=30)
        if date_to:
            end_date = timezone.datetime.fromisoformat(date_to)
        else:
            end_date = timezone.now()
    else:
        start_date = timezone.now() - timedelta(days=30)
    
    # Get orders in date range
    orders = Order.objects.filter(created_at__gte=start_date)
    if range_type == 'custom' and 'end_date' in locals():
        orders = orders.filter(created_at__lte=end_date)
    
    paid_orders = orders.filter(status='paid')
    pending_orders = orders.filter(status='pending')
    cancelled_orders = orders.filter(status='cancelled')
    
    # Calculate statistics
    total_revenue = paid_orders.aggregate(total=Sum('total'))['total'] or 0
    total_orders = orders.count()
    paid_count = paid_orders.count()
    avg_order_value = paid_orders.aggregate(avg=Avg('total'))['avg'] or 0
    
    # Top selling products in period
    top_products = OrderItem.objects.filter(
        order__in=paid_orders
    ).values(
        'product_variant__product__name',
        'product_variant__product__id'
    ).annotate(
        total_qty=Sum('qty'),
        total_revenue=Sum('line_total')
    ).order_by('-total_qty')[:10]
    
    return Response({
        'range': range_type,
        'start_date': start_date,
        'end_date': timezone.now() if range_type != 'custom' else end_date,
        'summary': {
            'total_revenue': float(total_revenue),
            'total_orders': total_orders,
            'paid_orders': paid_count,
            'pending_orders': pending_orders.count(),
            'cancelled_orders': cancelled_orders.count(),
            'average_order_value': float(avg_order_value),
            'conversion_rate': (paid_count / total_orders * 100) if total_orders > 0 else 0
        },
        'top_products': [
            {
                'product_id': item['product_variant__product__id'],
                'product_name': item['product_variant__product__name'],
                'total_qty': item['total_qty'],
                'total_revenue': float(item['total_revenue'])
            }
            for item in top_products
        ]
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_report(request):
    """
    Current inventory status with stock levels and valuation
    """
    inventory = Inventory.objects.all().select_related(
        'product_variant__product__brand'
    ).annotate(
        product_name=F('product_variant__product__name'),
        brand_name=F('product_variant__product__brand__name'),
        variant_sku=F('product_variant__sku'),
        unit_price=F('product_variant__price')
    )
    
    # Apply filters
    brand = request.query_params.get('brand', None)
    if brand:
        inventory = inventory.filter(product_variant__product__brand_id=brand)
    
    low_stock_threshold = int(request.query_params.get('low_stock_threshold', 10))
    
    # Calculate statistics
    total_items = inventory.count()
    total_stock_value = sum(inv.on_hand * float(inv.unit_price) for inv in inventory)
    out_of_stock = inventory.filter(on_hand=0).count()
    low_stock = inventory.filter(on_hand__gt=0, on_hand__lte=low_stock_threshold).count()
    in_stock = inventory.filter(on_hand__gt=low_stock_threshold).count()
    
    # Inventory list
    inventory_list = []
    for inv in inventory:
        inventory_list.append({
            'id': inv.id,
            'product_name': inv.product_name,
            'brand_name': inv.brand_name,
            'variant_sku': inv.variant_sku,
            'on_hand': inv.on_hand,
            'unit_price': float(inv.unit_price),
            'stock_value': inv.on_hand * float(inv.unit_price),
            'status': 'out_of_stock' if inv.on_hand == 0 else ('low_stock' if inv.on_hand <= low_stock_threshold else 'in_stock')
        })
    
    return Response({
        'summary': {
            'total_items': total_items,
            'total_stock_value': total_stock_value,
            'out_of_stock_count': out_of_stock,
            'low_stock_count': low_stock,
            'in_stock_count': in_stock
        },
        'inventory': inventory_list
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_products(request):
    """
    Top selling products by quantity and revenue
    Query params: limit, period (day|week|month|all)
    """
    limit = int(request.query_params.get('limit', 10))
    period = request.query_params.get('period', 'month')
    
    # Determine date range
    if period == 'day':
        start_date = timezone.now() - timedelta(days=1)
    elif period == 'week':
        start_date = timezone.now() - timedelta(days=7)
    elif period == 'month':
        start_date = timezone.now() - timedelta(days=30)
    else:
        start_date = None
    
    # Build query
    order_items = OrderItem.objects.filter(order__status='paid')
    if start_date:
        order_items = order_items.filter(order__created_at__gte=start_date)
    
    # Top by quantity
    top_by_qty = order_items.values(
        'product_variant__product__id',
        'product_variant__product__name',
        'product_variant__product__brand__name'
    ).annotate(
        total_qty=Sum('qty'),
        total_revenue=Sum('line_total'),
        order_count=Count('order', distinct=True)
    ).order_by('-total_qty')[:limit]
    
    # Top by revenue
    top_by_revenue = order_items.values(
        'product_variant__product__id',
        'product_variant__product__name',
        'product_variant__product__brand__name'
    ).annotate(
        total_qty=Sum('qty'),
        total_revenue=Sum('line_total'),
        order_count=Count('order', distinct=True)
    ).order_by('-total_revenue')[:limit]
    
    return Response({
        'period': period,
        'start_date': start_date,
        'top_by_quantity': [
            {
                'product_id': item['product_variant__product__id'],
                'product_name': item['product_variant__product__name'],
                'brand_name': item['product_variant__product__brand__name'],
                'total_qty': item['total_qty'],
                'total_revenue': float(item['total_revenue']),
                'order_count': item['order_count']
            }
            for item in top_by_qty
        ],
        'top_by_revenue': [
            {
                'product_id': item['product_variant__product__id'],
                'product_name': item['product_variant__product__name'],
                'brand_name': item['product_variant__product__brand__name'],
                'total_qty': item['total_qty'],
                'total_revenue': float(item['total_revenue']),
                'order_count': item['order_count']
            }
            for item in top_by_revenue
        ]
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Dashboard overview statistics
    """
    today = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    this_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Today's stats
    today_orders = Order.objects.filter(created_at__gte=today)
    today_revenue = today_orders.filter(status='paid').aggregate(total=Sum('total'))['total'] or 0
    
    # This month's stats
    month_orders = Order.objects.filter(created_at__gte=this_month)
    month_revenue = month_orders.filter(status='paid').aggregate(total=Sum('total'))['total'] or 0
    
    # Inventory stats
    total_products = Product.objects.filter(is_active=True).count()
    low_stock_items = Inventory.objects.filter(on_hand__lte=10, on_hand__gt=0).count()
    out_of_stock_items = Inventory.objects.filter(on_hand=0).count()
    
    # Customer stats
    total_customers = Customer.objects.filter(is_active=True).count()
    
    # Pending orders
    pending_orders_count = Order.objects.filter(status='pending').count()
    
    return Response({
        'today': {
            'orders_count': today_orders.count(),
            'revenue': float(today_revenue)
        },
        'this_month': {
            'orders_count': month_orders.count(),
            'revenue': float(month_revenue)
        },
        'inventory': {
            'total_products': total_products,
            'low_stock_count': low_stock_items,
            'out_of_stock_count': out_of_stock_items
        },
        'customers': {
            'total_count': total_customers
        },
        'pending_orders': pending_orders_count
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_movements_report(request):
    """
    Stock movements report (IN/OUT)
    Query params: date_from, date_to, type
    """
    movements = StockMovement.objects.all().select_related(
        'product_variant__product__brand'
    )
    
    # Apply filters
    date_from = request.query_params.get('date_from')
    date_to = request.query_params.get('date_to')
    movement_type = request.query_params.get('type')
    
    if date_from:
        movements = movements.filter(created_at__gte=date_from)
    if date_to:
        movements = movements.filter(created_at__lte=date_to)
    if movement_type:
        movements = movements.filter(type=movement_type.upper())
    
    # Calculate totals
    total_in = sum(m.qty for m in movements.filter(type='IN'))
    total_out = sum(m.qty for m in movements.filter(type='OUT'))
    
    return Response({
        'summary': {
            'total_movements': movements.count(),
            'total_in': total_in,
            'total_out': total_out,
            'net_change': total_in - total_out
        },
        'movements': [
            {
                'id': m.id,
                'type': m.type,
                'product_name': m.product_variant.product.name,
                'variant_sku': m.product_variant.sku,
                'qty': m.qty,
                'ref_type': m.ref_type,
                'ref_id': m.ref_id,
                'created_at': m.created_at
            }
            for m in movements.order_by('-created_at')[:100]
        ]
    }) 