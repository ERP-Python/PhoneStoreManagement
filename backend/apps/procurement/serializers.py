from rest_framework import serializers
from django.db import transaction
from .models import Supplier, PurchaseOrder, POItem, StockIn, StockInItem
from apps.catalog.serializers import ProductVariantSerializer


class SupplierSerializer(serializers.ModelSerializer):
    purchase_orders_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact', 'phone', 'email', 'address', 
                  'note', 'is_active', 'purchase_orders_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_purchase_orders_count(self, obj):
        return obj.purchase_orders.count()


class POItemSerializer(serializers.ModelSerializer):
    product_variant_name = serializers.CharField(source='product_variant.__str__', read_only=True)
    line_total = serializers.ReadOnlyField()
    
    class Meta:
        model = POItem
        fields = ['id', 'product_variant', 'product_variant_name', 'qty', 
                  'unit_cost', 'line_total']
        read_only_fields = ['id', 'line_total']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = POItemSerializer(many=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    total_amount = serializers.ReadOnlyField()
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    code = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = PurchaseOrder
        fields = ['id', 'code', 'supplier', 'supplier_name', 'status', 'note', 
                  'items', 'total_amount', 'created_by', 'created_by_name', 
                  'approved_by', 'approved_by_name', 'approved_at', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'approved_by', 'approved_at', 
                           'created_at', 'updated_at']
    
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate PO code if not provided
        if 'code' not in validated_data or not validated_data['code']:
            from django.utils import timezone
            validated_data['code'] = f"PO-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        
        purchase_order = PurchaseOrder.objects.create(**validated_data)
        
        for item_data in items_data:
            POItem.objects.create(purchase_order=purchase_order, **item_data)
        
        return purchase_order
    
    @transaction.atomic
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        # Update PO fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items if provided
        if items_data is not None:
            # Delete old items and create new ones
            instance.items.all().delete()
            for item_data in items_data:
                POItem.objects.create(purchase_order=instance, **item_data)
        
        return instance


class StockInItemSerializer(serializers.ModelSerializer):
    product_variant_name = serializers.CharField(source='product_variant.__str__', read_only=True)
    line_total = serializers.ReadOnlyField()
    
    class Meta:
        model = StockInItem
        fields = ['id', 'product_variant', 'product_variant_name', 'qty', 
                  'unit_cost', 'line_total']
        read_only_fields = ['id', 'line_total']


class StockInSerializer(serializers.ModelSerializer):
    items = StockInItemSerializer(many=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    code = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = StockIn
        fields = ['id', 'code', 'source', 'reference_id', 'note', 'items',
                  'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']
    
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate Stock In code if not provided
        if 'code' not in validated_data or not validated_data['code']:
            from django.utils import timezone
            validated_data['code'] = f"IN-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        
        stock_in = StockIn.objects.create(**validated_data)
        
        # Create items and update inventory
        from apps.inventory.models import Inventory, StockMovement
        
        for item_data in items_data:
            stock_in_item = StockInItem.objects.create(stock_in=stock_in, **item_data)
            
            # Update inventory
            inventory, created = Inventory.objects.get_or_create(
                product_variant=item_data['product_variant'],
                defaults={'on_hand': 0}
            )
            inventory.on_hand += item_data['qty']
            inventory.save()
            
            # Create stock movement
            StockMovement.objects.create(
                type='IN',
                product_variant=item_data['product_variant'],
                qty=item_data['qty'],
                ref_type='StockIn',
                ref_id=stock_in.id
            )
        
        return stock_in 