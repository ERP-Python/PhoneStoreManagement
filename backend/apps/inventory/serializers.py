from rest_framework import serializers
from django.db.models import Sum
from .models import Inventory, StockMovement


class InventorySerializer(serializers.ModelSerializer):
    # Product info
    product_name = serializers.CharField(source='product_variant.product.name', read_only=True)
    brand_name = serializers.CharField(source='product_variant.product.brand.name', read_only=True)
    
    # Variant info
    sku = serializers.CharField(source='product_variant.sku', read_only=True)
    ram = serializers.CharField(source='product_variant.ram', read_only=True)
    rom = serializers.CharField(source='product_variant.rom', read_only=True)
    color = serializers.CharField(source='product_variant.color', read_only=True)
    price = serializers.DecimalField(source='product_variant.price', max_digits=12, decimal_places=0, read_only=True)
    
    # Variant display name
    variant_display = serializers.SerializerMethodField()
    
    # Stock info
    reserved = serializers.SerializerMethodField()
    available = serializers.SerializerMethodField()
    low_stock_threshold = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = Inventory
        fields = [
            'id', 'product_variant', 'product_name', 'brand_name',
            'sku', 'ram', 'rom', 'color', 'variant_display', 'price',
            'on_hand', 'reserved', 'available', 'low_stock_threshold',
            'status', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']
    
    def get_variant_display(self, obj):
        """Get formatted variant display string"""
        parts = []
        if obj.product_variant.ram:
            parts.append(obj.product_variant.ram)
        if obj.product_variant.rom:
            parts.append(obj.product_variant.rom)
        if obj.product_variant.color:
            parts.append(obj.product_variant.color)
        
        return ' / '.join(parts) if parts else '-'
    
    def get_reserved(self, obj):
        """Get quantity reserved in pending orders"""
        from apps.sales.models import OrderItem
        
        reserved_qty = OrderItem.objects.filter(
            product_variant=obj.product_variant,
            order__status='pending'
        ).aggregate(total=Sum('qty'))['total'] or 0
        
        return int(reserved_qty)
    
    def get_available(self, obj):
        """Calculate available quantity (on_hand - reserved)"""
        reserved = self.get_reserved(obj)
        return max(0, obj.on_hand - reserved)
    
    def get_low_stock_threshold(self, obj):
        """Default low stock threshold (can be customized per product later)"""
        return 10
    
    def get_status(self, obj):
        """Determine stock status"""
        threshold = self.get_low_stock_threshold(obj)
        
        if obj.on_hand == 0:
            return {
                'value': 'out_of_stock',
                'label': 'Hết hàng',
                'color': 'error'
            }
        elif obj.on_hand <= threshold:
            return {
                'value': 'low_stock',
                'label': 'Sắp hết',
                'color': 'warning'
            }
        else:
            return {
                'value': 'in_stock',
                'label': 'Còn hàng',
                'color': 'success'
            }


class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product_variant.product.name', read_only=True)
    brand_name = serializers.CharField(source='product_variant.product.brand.name', read_only=True)
    variant_sku = serializers.CharField(source='product_variant.sku', read_only=True)
    variant_display = serializers.SerializerMethodField()
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = StockMovement
        fields = ['id', 'type', 'type_display', 'product_variant',
                  'product_name', 'brand_name', 'variant_sku', 'variant_display',
                  'qty', 'ref_type', 'ref_id', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_variant_display(self, obj):
        """Get formatted variant display string"""
        parts = []
        if obj.product_variant.ram:
            parts.append(obj.product_variant.ram)
        if obj.product_variant.rom:
            parts.append(obj.product_variant.rom)
        if obj.product_variant.color:
            parts.append(obj.product_variant.color)
        
        return ' / '.join(parts) if parts else '-' 