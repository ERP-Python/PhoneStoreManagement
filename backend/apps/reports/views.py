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
    Query params: low_stock_threshold (default 10)
    """
    today = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    this_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Get low stock threshold from query params or use default
    low_stock_threshold = int(request.query_params.get('low_stock_threshold', 10))
    
    # Today's stats
    today_orders = Order.objects.filter(created_at__gte=today)
    today_revenue = today_orders.filter(status='paid').aggregate(total=Sum('total'))['total'] or 0
    
    # This month's stats
    month_orders = Order.objects.filter(created_at__gte=this_month)
    month_revenue = month_orders.filter(status='paid').aggregate(total=Sum('total'))['total'] or 0
    
    # Inventory stats
    total_products = Product.objects.filter(is_active=True).count()
    total_variants = ProductVariant.objects.filter(is_active=True).count()
    
    # Get low stock items with details
    low_stock_items = Inventory.objects.filter(
        on_hand__lte=low_stock_threshold, 
        on_hand__gt=0
    ).select_related('product_variant__product__brand')
    
    out_of_stock_items = Inventory.objects.filter(on_hand=0).select_related(
        'product_variant__product__brand'
    )
    
    # Prepare low stock alert details
    low_stock_details = [
        {
            'id': item.id,
            'product_name': item.product_variant.product.name,
            'variant_sku': item.product_variant.sku,
            'brand': item.product_variant.product.brand.name,
            'on_hand': item.on_hand,
            'status': 'low_stock'
        }
        for item in low_stock_items[:10]  # Limit to top 10 for dashboard
    ]
    
    out_of_stock_details = [
        {
            'id': item.id,
            'product_name': item.product_variant.product.name,
            'variant_sku': item.product_variant.sku,
            'brand': item.product_variant.product.brand.name,
            'on_hand': 0,
            'status': 'out_of_stock'
        }
        for item in out_of_stock_items[:10]  # Limit to top 10 for dashboard
    ]
    
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
            'total_variants': total_variants,
            'low_stock_count': low_stock_items.count(),
            'out_of_stock_count': out_of_stock_items.count(),
            'low_stock_threshold': low_stock_threshold,
            'low_stock_items': low_stock_details,
            'out_of_stock_items': out_of_stock_details
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_revenue_chart(request):
    """
    Daily revenue chart data for last N days
    Query params: days (default 7)
    """
    from apps.reports.models import RevenueStats
    from datetime import date
    
    days = int(request.query_params.get('days', 7))
    today = date.today()
    
    # Get revenue stats for the last N days
    chart_data = []
    
    for i in range(days - 1, -1, -1):
        target_date = today - timedelta(days=i)
        
        # Try to get stats from RevenueStats first
        try:
            stats = RevenueStats.objects.get(date=target_date)
            revenue = float(stats.total_revenue)
            orders = stats.total_orders
        except RevenueStats.DoesNotExist:
            # Fallback: calculate from Order model
            day_start = timezone.datetime.combine(target_date, timezone.datetime.min.time())
            day_end = timezone.datetime.combine(target_date, timezone.datetime.max.time())
            if timezone.is_aware(day_start):
                day_start = timezone.make_aware(day_start)
                day_end = timezone.make_aware(day_end)
            
            day_orders = Order.objects.filter(
                created_at__gte=day_start,
                created_at__lte=day_end,
                status='paid'
            )
            revenue = float(day_orders.aggregate(total=Sum('total'))['total'] or 0)
            orders = day_orders.count()
        
        # Format day name in Vietnamese
        day_names = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
        weekday = target_date.weekday()
        day_name = day_names[weekday]
        
        chart_data.append({
            'date': str(target_date),
            'name': day_name,
            'doanhthu': revenue,
            'orders': orders,
            'formatted_date': target_date.strftime('%d/%m')
        })
    
    return Response({
        'days': days,
        'data': chart_data,
        'total_revenue': sum(item['doanhthu'] for item in chart_data),
        'total_orders': sum(item['orders'] for item in chart_data)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_revenue_chart(request):
    """
    Monthly revenue chart data for last N months
    Query params: months (default 12)
    """
    from apps.reports.models import RevenueStats
    from datetime import date
    
    months = int(request.query_params.get('months', 12))
    today = date.today()
    
    # Get revenue stats for the last N months
    chart_data = []
    
    for i in range(months - 1, -1, -1):
        # Calculate target month
        current_month = today.month - i
        current_year = today.year
        
        # Handle year boundary
        if current_month <= 0:
            current_year -= 1
            current_month += 12
        
        # Get first day and last day of the month
        month_start = date(current_year, current_month, 1)
        
        # Get last day of month
        if current_month == 12:
            next_month_start = date(current_year + 1, 1, 1)
        else:
            next_month_start = date(current_year, current_month + 1, 1)
        month_end = next_month_start - timedelta(days=1)
        
        # Calculate revenue for the month
        month_start_dt = timezone.datetime.combine(month_start, timezone.datetime.min.time())
        month_end_dt = timezone.datetime.combine(month_end, timezone.datetime.max.time())
        
        if timezone.is_aware(month_start_dt):
            month_start_dt = timezone.make_aware(month_start_dt)
            month_end_dt = timezone.make_aware(month_end_dt)
        
        month_orders = Order.objects.filter(
            created_at__gte=month_start_dt,
            created_at__lte=month_end_dt,
            status='paid'
        )
        revenue = float(month_orders.aggregate(total=Sum('total'))['total'] or 0)
        orders_count = month_orders.count()
        
        # Format month name in Vietnamese
        month_names = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                       'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
        month_name = month_names[current_month - 1]
        
        chart_data.append({
            'date': str(month_start),
            'name': month_name,
            'doanhthu': revenue,
            'orders': orders_count,
            'formatted_date': month_start.strftime('%m/%Y')
        })
    
    return Response({
        'months': months,
        'data': chart_data,
        'total_revenue': sum(item['doanhthu'] for item in chart_data),
        'total_orders': sum(item['orders'] for item in chart_data)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_stats(request):
    """
    Daily statistics for today
    """
    from datetime import date
    
    today = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday = today - timedelta(days=1)
    
    # Today's stats
    today_orders = Order.objects.filter(created_at__gte=today, status='paid')
    today_revenue = today_orders.aggregate(total=Sum('total'))['total'] or 0
    today_count = today_orders.count()
    
    # Yesterday's stats
    yesterday_orders = Order.objects.filter(created_at__gte=yesterday, created_at__lt=today, status='paid')
    yesterday_revenue = yesterday_orders.aggregate(total=Sum('total'))['total'] or 0
    yesterday_count = yesterday_orders.count()
    
    return Response({
        'revenue': float(today_revenue),
        'orders_count': today_count,
        'yesterday_revenue': float(yesterday_revenue),
        'yesterday_orders_count': yesterday_count
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthly_stats(request):
    """
    Monthly statistics for current month
    """
    today = timezone.now()
    current_month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Previous month
    if current_month_start.month == 1:
        previous_month_start = current_month_start.replace(year=current_month_start.year - 1, month=12)
    else:
        previous_month_start = current_month_start.replace(month=current_month_start.month - 1)
    
    # Current month stats
    current_orders = Order.objects.filter(created_at__gte=current_month_start, status='paid')
    current_revenue = current_orders.aggregate(total=Sum('total'))['total'] or 0
    current_count = current_orders.count()
    
    # Previous month stats
    previous_orders = Order.objects.filter(
        created_at__gte=previous_month_start,
        created_at__lt=current_month_start,
        status='paid'
    )
    previous_revenue = previous_orders.aggregate(total=Sum('total'))['total'] or 0
    previous_count = previous_orders.count()
    
    return Response({
        'revenue': float(current_revenue),
        'orders_count': current_count,
        'previous_month_revenue': float(previous_revenue),
        'previous_month_orders_count': previous_count
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def yearly_stats(request):
    """
    Yearly statistics for current year
    """
    today = timezone.now()
    current_year_start = today.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    previous_year_start = current_year_start.replace(year=current_year_start.year - 1)
    
    # Current year stats
    current_orders = Order.objects.filter(created_at__gte=current_year_start, status='paid')
    current_revenue = current_orders.aggregate(total=Sum('total'))['total'] or 0
    current_count = current_orders.count()
    
    # Previous year stats
    previous_orders = Order.objects.filter(
        created_at__gte=previous_year_start,
        created_at__lt=current_year_start,
        status='paid'
    )
    previous_revenue = previous_orders.aggregate(total=Sum('total'))['total'] or 0
    previous_count = previous_orders.count()
    
    return Response({
        'revenue': float(current_revenue),
        'orders_count': current_count,
        'previous_year_revenue': float(previous_revenue),
        'previous_year_orders_count': previous_count
    })