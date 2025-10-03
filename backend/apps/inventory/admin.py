from django.contrib import admin
from .models import Inventory, StockMovement


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['get_product_name', 'get_variant_info', 'on_hand', 'get_stock_status', 'updated_at']
    list_filter = ['updated_at', 'product_variant__product__brand']
    search_fields = ['product_variant__product__name', 'product_variant__sku']
    readonly_fields = ['on_hand', 'updated_at']
    autocomplete_fields = ['product_variant']
    
    def get_product_name(self, obj):
        return obj.product_variant.product.name
    get_product_name.short_description = 'Product'
    get_product_name.admin_order_field = 'product_variant__product__name'
    
    def get_variant_info(self, obj):
        parts = []
        if obj.product_variant.ram:
            parts.append(obj.product_variant.ram)
        if obj.product_variant.rom:
            parts.append(obj.product_variant.rom)
        if obj.product_variant.color:
            parts.append(obj.product_variant.color)
        return ' - '.join(parts) if parts else 'N/A'
    get_variant_info.short_description = 'Variant'
    
    def get_stock_status(self, obj):
        if obj.on_hand == 0:
            return '🔴 Out of Stock'
        elif obj.on_hand <= 10:
            return '🟡 Low Stock'
        else:
            return '🟢 In Stock'
    get_stock_status.short_description = 'Status'
    
    def has_add_permission(self, request):
        # Inventory is auto-created via signals
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Prevent manual deletion
        return False


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['get_product_name', 'type', 'qty', 'ref_type', 'ref_id', 'created_at']
    list_filter = ['type', 'ref_type', 'created_at']
    search_fields = ['product_variant__product__name', 'product_variant__sku']
    readonly_fields = ['type', 'product_variant', 'qty', 'ref_type', 'ref_id', 'created_at']
    date_hierarchy = 'created_at'
    
    def get_product_name(self, obj):
        return obj.product_variant.product.name
    get_product_name.short_description = 'Product'
    get_product_name.admin_order_field = 'product_variant__product__name'
    
    def has_add_permission(self, request):
        # Stock movements are auto-created
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Prevent manual deletion for audit trail
        return request.user.is_superuser
    
    def has_change_permission(self, request, obj=None):
        # Prevent editing for audit trail
        return False 