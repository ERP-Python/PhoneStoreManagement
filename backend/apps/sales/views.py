from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.utils import timezone
from django.shortcuts import redirect
from django.conf import settings
import json
import logging

from .models import Order, Payment, StockOut
from .serializers import (
    OrderSerializer, PaymentSerializer, StockOutSerializer
)
from .vnpay import VNPayService

logger = logging.getLogger(__name__)


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order management"""
    queryset = Order.objects.all().select_related(
        'customer', 'created_by'
    ).prefetch_related('items__product_variant__product__brand')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'customer__name', 'customer__phone']
    ordering_fields = ['created_at', 'total']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by customer
        customer = self.request.query_params.get('customer', None)
        if customer:
            queryset = queryset.filter(customer_id=customer)
        
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
    def create_vnpay_payment(self, request, pk=None):
        """Create VNPay payment URL for order"""
        order = self.get_object()
        
        if order.status == 'paid':
            return Response(
                {'error': 'Order is already paid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get bank code from request (optional)
        bank_code = request.data.get('bank_code', None)
        
        # Create payment record
        payment = Payment.objects.create(
            order=order,
            method='vnpay',
            amount=order.total,
            status='pending'
        )
        
        # Generate VNPay payment URL
        vnpay = VNPayService()
        
        try:
            payment_url = vnpay.create_payment_url(
                order_code=order.code,
                amount=float(order.total),
                order_desc=f"Thanh toan don hang {order.code}",
                ip_addr=self.get_client_ip(request),
                bank_code=bank_code
            )
            
            return Response({
                'payment_id': payment.id,
                'payment_url': payment_url,
                'order_code': order.code,
                'amount': float(order.total),
                'is_sandbox': vnpay.is_sandbox_mode(),
                'bank_code': bank_code
            })
            
        except Exception as e:
            logger.error(f"Error creating VNPay payment: {str(e)}")
            return Response(
                {'error': 'Failed to create payment URL'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def vnpay_banks(self, request):
        """Get list of supported banks for VNPay"""
        vnpay = VNPayService()
        banks = vnpay.get_bank_list()
        return Response({
            'banks': banks,
            'is_sandbox': vnpay.is_sandbox_mode()
        })
    
    @action(detail=False, methods=['get'])
    def vnpay_payment_methods(self, request):
        """Get available payment methods for VNPay"""
        vnpay = VNPayService()
        methods = vnpay.get_payment_methods()
        return Response({
            'methods': methods,
            'is_sandbox': vnpay.is_sandbox_mode()
        })
    
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def fulfill(self, request, pk=None):
        """Create Stock Out record for order (inventory already reduced at order creation)"""
        order = self.get_object()
        
        if order.status != 'paid':
            return Response(
                {'error': 'Order must be paid before fulfillment'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already fulfilled
        if order.stock_outs.exists():
            return Response(
                {'error': 'Order has already been fulfilled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Inventory already reduced when order was created
        # Just create StockOut record for tracking without reducing inventory again
        from django.utils import timezone
        from .models import StockOutItem
        
        stock_out = StockOut.objects.create(
            code=f"OUT-{timezone.now().strftime('%Y%m%d%H%M%S')}",
            order=order,
            note=f'Fulfillment for order {order.code}',
            created_by=request.user
        )
        
        # Create stock out items (without reducing inventory)
        for order_item in order.items.all():
            StockOutItem.objects.create(
                stock_out=stock_out,
                product_variant=order_item.product_variant,
                qty=order_item.qty
            )
        
        serializer = StockOutSerializer(stock_out)
        return Response({
            'message': 'Order fulfilled successfully',
            'stock_out': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def cancel(self, request, pk=None):
        """Cancel an order and restore inventory"""
        order = self.get_object()
        
        if order.status == 'paid':
            return Response(
                {'error': 'Cannot cancel paid order'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if order.status == 'cancelled':
            return Response(
                {'error': 'Order is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restore inventory for cancelled order
        from apps.inventory.models import Inventory, StockMovement
        
        for order_item in order.items.all():
            # Check if inventory was reduced for this order
            stock_movements = StockMovement.objects.filter(
                ref_type='Order',
                ref_id=order.id,
                product_variant=order_item.product_variant,
                type='OUT'
            )
            
            if stock_movements.exists():
                # Restore inventory
                try:
                    inventory = Inventory.objects.select_for_update().get(
                        product_variant=order_item.product_variant
                    )
                    inventory.on_hand += order_item.qty
                    inventory.save()
                    
                    # Create stock movement record for restoration
                    StockMovement.objects.create(
                        type='IN',
                        product_variant=order_item.product_variant,
                        qty=order_item.qty,
                        ref_type='OrderCancellation',
                        ref_id=order.id
                    )
                except Inventory.DoesNotExist:
                    logger.error(f'Inventory not found for variant {order_item.product_variant.sku}')
        
        order.status = 'cancelled'
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        """Get all payments for an order"""
        order = self.get_object()
        payments = order.payments.all().order_by('-created_at')
        serializer = PaymentSerializer(payments, many=True)
        return Response({
            'order_code': order.code,
            'count': payments.count(),
            'payments': serializer.data
        })
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR', '127.0.0.1')
        return ip


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Payment management (Read-only)"""
    queryset = Payment.objects.all().select_related('order')
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['order__code', 'txn_code']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by method
        method = self.request.query_params.get('method', None)
        if method:
            queryset = queryset.filter(method=method)
        
        return queryset


class StockOutViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Stock Out management (Read-only)"""
    queryset = StockOut.objects.all().select_related(
        'order', 'created_by'
    ).prefetch_related('items__product_variant__product__brand')
    serializer_class = StockOutSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'order__code']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by order
        order = self.request.query_params.get('order', None)
        if order:
            queryset = queryset.filter(order_id=order)
        
        # Filter by date range
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset


# VNPay Callback Views
@api_view(['GET'])
@permission_classes([AllowAny])
def vnpay_return(request):
    """
    Handle VNPay return callback
    This is called when user completes payment on VNPay
    """
    vnpay = VNPayService()
    response_data = request.GET.dict()
    
    logger.info(f"VNPay return callback received: {response_data}")
    
    # Validate VNPay response
    is_success, txn_code, amount, order_code, raw_response = vnpay.validate_response(response_data)
    
    try:
        # Find order and payment
        order = Order.objects.get(code=order_code)
        payment = order.payments.filter(status='pending').order_by('-created_at').first()
        
        if payment:
            # Update payment record
            payment.txn_code = txn_code
            payment.raw_response_json = json.dumps(raw_response)
            
            if is_success:
                payment.status = 'success'
                payment.paid_at = timezone.now()
                
                # Update order status
                order.status = 'paid'
                order.paid_total = amount
                order.save()
                
                logger.info(f"Payment successful for order {order_code}")
            else:
                payment.status = 'failed'
                logger.warning(f"Payment failed for order {order_code}")
            
            payment.save()
        
        # Redirect to frontend with payment status
        frontend_url = settings.CORS_ALLOWED_ORIGINS[0] if settings.CORS_ALLOWED_ORIGINS else 'http://localhost:3000'
        redirect_url = f"{frontend_url}/orders/{order.id}?payment_status={'success' if is_success else 'failed'}"
        
        return redirect(redirect_url)
        
    except Order.DoesNotExist:
        logger.error(f"Order not found: {order_code}")
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error processing VNPay return: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def vnpay_ipn(request):
    """
    Handle VNPay IPN (Instant Payment Notification)
    This is VNPay's server-to-server callback
    """
    vnpay = VNPayService()
    response_data = request.data if request.data else request.GET.dict()
    
    logger.info(f"VNPay IPN received: {response_data}")
    
    # Validate VNPay response
    is_success, txn_code, amount, order_code, raw_response = vnpay.validate_response(response_data)
    
    try:
        order = Order.objects.get(code=order_code)
        payment = order.payments.filter(status='pending').order_by('-created_at').first()
        
        if payment and is_success:
            payment.txn_code = txn_code
            payment.raw_response_json = json.dumps(raw_response)
            payment.status = 'success'
            payment.paid_at = timezone.now()
            payment.save()
            
            order.status = 'paid'
            order.paid_total = amount
            order.save()
            
            logger.info(f"IPN payment successful for order {order_code}")
            return Response({'RspCode': '00', 'Message': 'Success'})
        
        logger.warning(f"IPN payment failed for order {order_code}")
        return Response({'RspCode': '01', 'Message': 'Order not found or payment failed'})
        
    except Exception as e:
        logger.error(f"Error processing VNPay IPN: {str(e)}")
        return Response({'RspCode': '99', 'Message': str(e)})


# Additional VNPay utility views
@api_view(['GET'])
@permission_classes([AllowAny])
def vnpay_config(request):
    """
    Get VNPay configuration for frontend
    """
    vnpay = VNPayService()
    
    return Response({
        'is_sandbox': vnpay.is_sandbox_mode(),
        'payment_url': vnpay.vnp_payment_url,
        'return_url': vnpay.vnp_return_url,
        'banks': vnpay.get_bank_list(),
        'payment_methods': vnpay.get_payment_methods(),
    }) 