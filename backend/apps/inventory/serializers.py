from rest_framework import serializers
from .models import Inventory, StockMovement
from apps.catalog.serializers import ProductVariantSerializer


class InventorySerializer(serializers.ModelSerializer):
    product_variant_details = ProductVariantSerializer(source='product_variant', read_only=True)
    product_name = serializers.CharField(source='product_variant.product.name', read_only=True)
    brand_name = serializers.CharField(source='product_variant.product.brand.name', read_only=True)
    variant_sku = serializers.CharField(source='product_variant.sku', read_only=True)
    price = serializers.DecimalField(source='product_variant.price', max_digits=12, decimal_places=0, read_only=True)
    
    class Meta:
        model = Inventory
        fields = ['id', 'product_variant', 'product_variant_details', 'product_name',
                  'brand_name', 'variant_sku', 'price', 'on_hand', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class StockMovementSerializer(serializers.ModelSerializer):
    product_variant_details = ProductVariantSerializer(source='product_variant', read_only=True)
    product_name = serializers.CharField(source='product_variant.product.name', read_only=True)
    variant_sku = serializers.CharField(source='product_variant.sku', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = StockMovement
        fields = ['id', 'type', 'type_display', 'product_variant', 'product_variant_details',
                  'product_name', 'variant_sku', 'qty', 'ref_type', 'ref_id', 'created_at']
        read_only_fields = ['id', 'created_at'] 