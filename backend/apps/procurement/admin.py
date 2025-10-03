from django.contrib import admin
from django.utils import timezone
from .models import Supplier, PurchaseOrder, POItem, StockIn, StockInItem


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact', 'phone', 'email', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'contact', 'phone', 'email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'contact', 'is_active')
        }),
        ('Contact Details', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Additional Information', {
            'fields': ('note',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class POItemInline(admin.TabularInline):
    model = POItem
    extra = 1
    autocomplete_fields = ['product_variant']
    readonly_fields = ['line_total']


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['code', 'supplier', 'status', 'get_total_amount', 'created_by', 'created_at']
    list_filter = ['status', 'created_at', 'supplier']
    search_fields = ['code', 'supplier__name']
    readonly_fields = ['created_by', 'created_at', 'updated_at', 'approved_by', 'approved_at', 'total_amount']
    autocomplete_fields = ['supplier']
    inlines = [POItemInline]
    
    fieldsets = (
        ('Purchase Order Information', {
            'fields': ('code', 'supplier', 'status')
        }),
        ('Additional Information', {
            'fields': ('note',)
        }),
        ('Approval Information', {
            'fields': ('approved_by', 'approved_at'),
            'classes': ('collapse',)
        }),
        ('Audit Information', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_orders', 'cancel_orders']
    
    def get_total_amount(self, obj):
        return f"{obj.total_amount:,.0f} VND"
    get_total_amount.short_description = 'Total Amount'
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    def approve_orders(self, request, queryset):
        updated = queryset.filter(status='draft').update(
            status='approved',
            approved_by=request.user,
            approved_at=timezone.now()
        )
        self.message_user(request, f'{updated} purchase order(s) were approved.')
    approve_orders.short_description = "Approve selected purchase orders"
    
    def cancel_orders(self, request, queryset):
        updated = queryset.exclude(status='cancelled').update(status='cancelled')
        self.message_user(request, f'{updated} purchase order(s) were cancelled.')
    cancel_orders.short_description = "Cancel selected purchase orders"


class StockInItemInline(admin.TabularInline):
    model = StockInItem
    extra = 1
    autocomplete_fields = ['product_variant']
    readonly_fields = ['line_total']


@admin.register(StockIn)
class StockInAdmin(admin.ModelAdmin):
    list_display = ['code', 'source', 'reference_id', 'created_by', 'created_at']
    list_filter = ['source', 'created_at']
    search_fields = ['code', 'note']
    readonly_fields = ['created_by', 'created_at']
    inlines = [StockInItemInline]
    
    fieldsets = (
        ('Stock In Information', {
            'fields': ('code', 'source', 'reference_id')
        }),
        ('Additional Information', {
            'fields': ('note',)
        }),
        ('Audit Information', {
            'fields': ('created_by', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change) 