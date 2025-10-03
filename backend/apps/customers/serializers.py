from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()
    last_order_date = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = ['id', 'name', 'phone', 'email', 'address', 'note', 'is_active',
                  'orders_count', 'total_spent', 'last_order_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_orders_count(self, obj):
        return obj.orders.count()
    
    def get_total_spent(self, obj):
        from apps.sales.models import Order
        total = sum(order.total for order in obj.orders.filter(status='paid'))
        return float(total) if total else 0
    
    def get_last_order_date(self, obj):
        last_order = obj.orders.order_by('-created_at').first()
        return last_order.created_at if last_order else None


class CustomerCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating customers"""
    class Meta:
        model = Customer
        fields = ['name', 'phone', 'email', 'address', 'note', 'is_active']
    
    def validate_phone(self, value):
        """Validate phone number uniqueness"""
        if Customer.objects.filter(phone=value).exists():
            if self.instance and self.instance.phone == value:
                return value
            raise serializers.ValidationError("Phone number already exists.")
        return value 