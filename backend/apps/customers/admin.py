from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'get_orders_count', 'get_total_spent', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'phone', 'email']
    readonly_fields = ['created_at', 'updated_at', 'get_orders_count', 'get_total_spent']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'phone', 'email', 'is_active')
        }),
        ('Contact Details', {
            'fields': ('address',)
        }),
        ('Additional Information', {
            'fields': ('note',)
        }),
        ('Statistics', {
            'fields': ('get_orders_count', 'get_total_spent'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_orders_count(self, obj):
        return obj.orders.count()
    get_orders_count.short_description = 'Total Orders'
    
    def get_total_spent(self, obj):
        from apps.sales.models import Order
        total = sum(order.total for order in obj.orders.filter(status='paid'))
        return f"{total:,.0f} VND" if total else "0 VND"
    get_total_spent.short_description = 'Total Spent' 