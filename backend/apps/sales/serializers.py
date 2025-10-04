from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem, Payment, StockOut, StockOutItem
from apps.customers.serializers import CustomerSerializer
import logging

logger = logging.getLogger(__name__)


class OrderItemSerializer(serializers.ModelSerializer):
    product_variant_name = serializers.CharField(source='product_variant.__str__', read_only=True)
    product_name = serializers.CharField(source='product_variant.product.name', read_only=True)
    variant_sku = serializers.CharField(source='product_variant.sku', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product_variant', 'product_variant_name', 'product_name',
                  'variant_sku', 'qty', 'unit_price', 'line_total']
        read_only_fields = ['id', 'unit_price', 'line_total']
    
    def validate(self, data):
        """Validate stock availability"""
        variant = data.get('product_variant')
        qty = data.get('qty')
        
        if variant and qty:
            from apps.inventory.models import Inventory
            try:
                inventory = Inventory.objects.get(product_variant=variant)
                if inventory.on_hand < qty:
                    raise serializers.ValidationError({
                        'qty': f'Insufficient stock. Only {inventory.on_hand} available.'
                    })
            except Inventory.DoesNotExist:
                raise serializers.ValidationError({
                    'product_variant': 'Product variant has no inventory record.'
                })
        
        return data


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_details = CustomerSerializer(source='customer', read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True, allow_null=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    code = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Order
        fields = ['id', 'code', 'customer', 'customer_details', 'customer_name',
                  'status', 'subtotal', 'total', 'paid_total', 'note', 'items',
                  'created_by', 'created_by_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'subtotal', 'total', 'paid_total', 'created_by',
                           'created_at', 'updated_at']
    
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate order code if not provided
        if 'code' not in validated_data or not validated_data['code']:
            from django.utils import timezone
            validated_data['code'] = f"ORD-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        
        order = Order.objects.create(**validated_data)
        logger.info(f"Created order {order.code} with id {order.id}")
        
        # Import Inventory and StockMovement models
        from apps.inventory.models import Inventory, StockMovement
        
        # Create order items with snapshot price and reduce inventory
        for item_data in items_data:
            variant = item_data['product_variant']
            qty = item_data['qty']
            item_data['unit_price'] = variant.price  # Snapshot current price
            OrderItem.objects.create(order=order, **item_data)
            
            logger.info(f"Processing variant {variant.id} (SKU: {variant.sku}), qty: {qty}")
            
            # Reduce inventory immediately when order is created
            try:
                inventory = Inventory.objects.select_for_update().get(product_variant=variant)
                old_qty = inventory.on_hand
                inventory.on_hand -= qty
                inventory.save()
                
                logger.info(f"Reduced inventory for variant {variant.sku}: {old_qty} -> {inventory.on_hand}")
                
                # Create stock movement record
                movement = StockMovement.objects.create(
                    type='OUT',
                    product_variant=variant,
                    qty=qty,
                    ref_type='Order',
                    ref_id=order.id
                )
                logger.info(f"Created StockMovement id={movement.id} for order {order.code}")
                
            except Inventory.DoesNotExist:
                logger.error(f'Inventory not found for variant {variant.sku} (id={variant.id})')
                # This should not happen if validation is correct
                raise serializers.ValidationError({
                    'items': f'Inventory not found for variant {variant.sku}'
                })
            except Exception as e:
                logger.error(f'Error reducing inventory: {str(e)}')
                raise
        
        # Calculate totals
        order.calculate_totals()
        
        return order
    
    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update order fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items if provided
        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                variant = item_data['product_variant']
                item_data['unit_price'] = variant.price
                OrderItem.objects.create(order=instance, **item_data)
            instance.calculate_totals()
        
        return instance


class PaymentSerializer(serializers.ModelSerializer):
    order_code = serializers.CharField(source='order.code', read_only=True)
    method_display = serializers.CharField(source='get_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'order', 'order_code', 'method', 'method_display',
                  'amount', 'status', 'status_display', 'txn_code',
                  'raw_response_json', 'paid_at', 'created_at']
        read_only_fields = ['id', 'txn_code', 'raw_response_json', 'paid_at', 'created_at']


class StockOutItemSerializer(serializers.ModelSerializer):
    product_variant_name = serializers.CharField(source='product_variant.__str__', read_only=True)
    
    class Meta:
        model = StockOutItem
        fields = ['id', 'product_variant', 'product_variant_name', 'qty']
        read_only_fields = ['id']


class StockOutSerializer(serializers.ModelSerializer):
    items = StockOutItemSerializer(many=True)
    order_code = serializers.CharField(source='order.code', read_only=True, allow_null=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = StockOut
        fields = ['id', 'code', 'order', 'order_code', 'note', 'items',
                  'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']
    
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate Stock Out code if not provided
        if 'code' not in validated_data or not validated_data['code']:
            from django.utils import timezone
            validated_data['code'] = f"OUT-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        
        stock_out = StockOut.objects.create(**validated_data)
        
        # Create items and reduce inventory
        from apps.inventory.models import Inventory, StockMovement
        
        for item_data in items_data:
            stock_out_item = StockOutItem.objects.create(stock_out=stock_out, **item_data)
            
            # Reduce inventory
            inventory = Inventory.objects.get(product_variant=item_data['product_variant'])
            inventory.on_hand -= item_data['qty']
            inventory.save()
            
            # Create stock movement
            StockMovement.objects.create(
                type='OUT',
                product_variant=item_data['product_variant'],
                qty=item_data['qty'],
                ref_type='StockOut',
                ref_id=stock_out.id
            )
        
        return stock_out