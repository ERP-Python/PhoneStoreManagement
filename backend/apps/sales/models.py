from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal


class Order(models.Model):
    """Order model"""
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    code = models.CharField(max_length=50, unique=True, db_index=True)
    customer = models.ForeignKey('customers.Customer', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    subtotal = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    total = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    paid_total = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    note = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.code} - {self.status}"

    def calculate_totals(self):
        """Calculate order totals from items"""
        self.subtotal = sum(item.line_total for item in self.items.all() if item.line_total)
        self.total = self.subtotal  # No tax in this system
        self.save()


class OrderItem(models.Model):
    """Order Item model"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.PROTECT)
    qty = models.IntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=12, decimal_places=0)  # Snapshot price
    line_total = models.DecimalField(max_digits=15, decimal_places=0)

    class Meta:
        db_table = 'order_items'
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f"{self.order.code} - {self.product_variant}"

    def save(self, *args, **kwargs):
        # Auto-fill unit_price from product variant if not set
        if self.unit_price is None and self.product_variant:
            self.unit_price = self.product_variant.price
        
        # Calculate line total
        if self.qty is not None and self.unit_price is not None:
            self.line_total = self.qty * self.unit_price
        else:
            self.line_total = Decimal('0')
        super().save(*args, **kwargs)


class Payment(models.Model):
    """Payment model"""
    METHOD_CHOICES = [
        ('vnpay', 'VNPay'),
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='vnpay')
    amount = models.DecimalField(max_digits=15, decimal_places=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # VNPay specific fields
    txn_code = models.CharField(max_length=100, blank=True, null=True, db_index=True)  # VNPay transaction code
    vnp_txn_ref = models.CharField(max_length=100, blank=True, null=True, db_index=True)  # VNPay transaction reference
    vnp_response_code = models.CharField(max_length=10, blank=True, null=True)  # VNPay response code
    vnp_bank_code = models.CharField(max_length=20, blank=True, null=True)  # Bank code used
    vnp_card_type = models.CharField(max_length=20, blank=True, null=True)  # Card type (ATM, CREDIT, etc.)
    vnp_pay_date = models.DateTimeField(blank=True, null=True)  # VNPay payment date
    
    # Additional fields for better tracking
    raw_response_json = models.TextField(blank=True, null=True)  # Store VNPay response
    error_message = models.TextField(blank=True, null=True)  # Error message if payment failed
    ip_address = models.GenericIPAddressField(blank=True, null=True)  # Client IP address
    user_agent = models.TextField(blank=True, null=True)  # User agent
    
    # Timestamps
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        indexes = [
            models.Index(fields=['txn_code']),
            models.Index(fields=['vnp_txn_ref']),
            models.Index(fields=['order', 'status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.order.code} - {self.method} - {self.status}"
    
    def is_vnpay_payment(self):
        """Check if this is a VNPay payment"""
        return self.method == 'vnpay'
    
    def is_successful(self):
        """Check if payment is successful"""
        return self.status == 'success'
    
    def get_vnpay_response_data(self):
        """Get VNPay response data as dict"""
        if self.raw_response_json:
            import json
            try:
                return json.loads(self.raw_response_json)
            except:
                return {}
        return {}


class StockOut(models.Model):
    """Stock Out model"""
    code = models.CharField(max_length=50, unique=True, db_index=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_outs')
    note = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_stock_outs')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stock_outs'
        ordering = ['-created_at']
        verbose_name = 'Stock Out'
        verbose_name_plural = 'Stock Outs'
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.code} - Order: {self.order.code if self.order else 'N/A'}"


class StockOutItem(models.Model):
    """Stock Out Item model"""
    stock_out = models.ForeignKey(StockOut, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.PROTECT)
    qty = models.IntegerField(validators=[MinValueValidator(1)])

    class Meta:
        db_table = 'stock_out_items'
        verbose_name = 'Stock Out Item'
        verbose_name_plural = 'Stock Out Items'

    def __str__(self):
        return f"{self.stock_out.code} - {self.product_variant}"