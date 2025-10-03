from django.contrib import admin
from django.utils.html import format_html
from django import forms
from .models import Order, OrderItem, Payment, StockOut, StockOutItem


class OrderItemForm(forms.ModelForm):
    """Custom form for OrderItem to auto-fill unit_price"""
    
    unit_price = forms.DecimalField(max_digits=12, decimal_places=0, required=False, label='Unit Price')
    
    class Meta:
        model = OrderItem
        fields = '__all__'
    
    def clean(self):
        cleaned_data = super().clean()
        product_variant = cleaned_data.get('product_variant')
        unit_price = cleaned_data.get('unit_price')
        
        # Auto-fill unit_price from product_variant if not provided
        if product_variant and not unit_price:
            cleaned_data['unit_price'] = product_variant.price
        
        return cleaned_data


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    form = OrderItemForm
    extra = 1
    fields = ['product_variant', 'qty', 'unit_price', 'line_total']
    readonly_fields = ['line_total']
    autocomplete_fields = ['product_variant']


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ['method', 'amount', 'status', 'txn_code', 'paid_at', 'created_at']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['code', 'customer', 'get_status_badge', 'get_total', 'created_by', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['code', 'customer__name', 'customer__phone']
    readonly_fields = ['created_by', 'subtotal', 'total', 'paid_total', 'created_at', 'updated_at']
    autocomplete_fields = ['customer']
    inlines = [OrderItemInline, PaymentInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('code', 'customer', 'status')
        }),
        ('Financial Details', {
            'fields': ('subtotal', 'total', 'paid_total')
        }),
        ('Additional Information', {
            'fields': ('note',)
        }),
        ('Audit Information', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_status_badge(self, obj):
        colors = {
            'pending': 'orange',
            'paid': 'green',
            'cancelled': 'red'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    get_status_badge.short_description = 'Status'
    
    def get_total(self, obj):
        return f"{obj.total:,.0f} VND"
    get_total.short_description = 'Total'
    get_total.admin_order_field = 'total'
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    def save_formset(self, request, form, formset, change):
        """Save formset and recalculate order totals"""
        instances = formset.save(commit=False)
        for instance in instances:
            instance.save()
        formset.save_m2m()
        
        # Delete removed items
        for obj in formset.deleted_objects:
            obj.delete()
        
        # Recalculate order totals
        if form.instance.pk:
            form.instance.calculate_totals()


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['get_order_code', 'method', 'get_amount', 'get_status_badge', 'txn_code', 'created_at']
    list_filter = ['method', 'status', 'created_at']
    search_fields = ['order__code', 'txn_code']
    readonly_fields = ['order', 'method', 'amount', 'status', 'txn_code', 'raw_response_json', 'paid_at', 'created_at']
    
    def get_order_code(self, obj):
        return obj.order.code
    get_order_code.short_description = 'Order'
    get_order_code.admin_order_field = 'order__code'
    
    def get_amount(self, obj):
        return f"{obj.amount:,.0f} VND"
    get_amount.short_description = 'Amount'
    get_amount.admin_order_field = 'amount'
    
    def get_status_badge(self, obj):
        colors = {
            'pending': 'orange',
            'success': 'green',
            'failed': 'red'
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    get_status_badge.short_description = 'Status'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


class StockOutItemInline(admin.TabularInline):
    model = StockOutItem
    extra = 0
    readonly_fields = ['product_variant', 'qty']
    can_delete = False


@admin.register(StockOut)
class StockOutAdmin(admin.ModelAdmin):
    list_display = ['code', 'get_order_code', 'created_by', 'created_at']
    list_filter = ['created_at']
    search_fields = ['code', 'order__code']
    readonly_fields = ['code', 'order', 'note', 'created_by', 'created_at']
    inlines = [StockOutItemInline]
    
    def get_order_code(self, obj):
        return obj.order.code if obj.order else 'N/A'
    get_order_code.short_description = 'Order'
    get_order_code.admin_order_field = 'order__code'
    
    def has_add_permission(self, request):
        # Stock Out created via API
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion for audit trail
        return request.user.is_superuser 