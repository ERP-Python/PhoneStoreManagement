from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal


class Supplier(models.Model):
    """Supplier model"""
    name = models.CharField(max_length=200)
    contact = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'suppliers'
        ordering = ['name']
        verbose_name = 'Supplier'
        verbose_name_plural = 'Suppliers'

    def __str__(self):
        return self.name


class PurchaseOrder(models.Model):
    """Purchase Order model"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('approved', 'Approved'),
        ('cancelled', 'Cancelled'),
    ]
    
    code = models.CharField(max_length=50, unique=True, db_index=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='purchase_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    note = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_pos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_pos')

    class Meta:
        db_table = 'purchase_orders'
        ordering = ['-created_at']
        verbose_name = 'Purchase Order'
        verbose_name_plural = 'Purchase Orders'
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['supplier', 'status']),
        ]

    def __str__(self):
        return f"{self.code} - {self.supplier.name}"

    @property
    def total_amount(self):
        return sum(item.line_total for item in self.items.all() if item.line_total)


class POItem(models.Model):
    """Purchase Order Item model"""
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.PROTECT)
    qty = models.IntegerField(validators=[MinValueValidator(1)])
    unit_cost = models.DecimalField(max_digits=12, decimal_places=0, validators=[MinValueValidator(Decimal('0'))])

    class Meta:
        db_table = 'po_items'
        verbose_name = 'PO Item'
        verbose_name_plural = 'PO Items'

    def __str__(self):
        return f"{self.purchase_order.code} - {self.product_variant}"

    @property
    def line_total(self):
        if self.qty is not None and self.unit_cost is not None:
            return self.qty * self.unit_cost
        return Decimal('0')


class StockIn(models.Model):
    """Stock In / Goods Receipt model"""
    SOURCE_CHOICES = [
        ('PO', 'From Purchase Order'),
        ('MANUAL', 'Manual Entry'),
    ]
    
    code = models.CharField(max_length=50, unique=True, db_index=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='MANUAL')
    reference_id = models.IntegerField(blank=True, null=True)  # PO ID if from PO
    note = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_stock_ins')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stock_ins'
        ordering = ['-created_at']
        verbose_name = 'Stock In'
        verbose_name_plural = 'Stock Ins'
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.code} - {self.get_source_display()}"


class StockInItem(models.Model):
    """Stock In Item model"""
    stock_in = models.ForeignKey(StockIn, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.PROTECT)
    qty = models.IntegerField(validators=[MinValueValidator(1)])
    unit_cost = models.DecimalField(max_digits=12, decimal_places=0, validators=[MinValueValidator(Decimal('0'))])

    class Meta:
        db_table = 'stock_in_items'
        verbose_name = 'Stock In Item'
        verbose_name_plural = 'Stock In Items'

    def __str__(self):
        return f"{self.stock_in.code} - {self.product_variant}"

    @property
    def line_total(self):
        if self.qty is not None and self.unit_cost is not None:
            return self.qty * self.unit_cost
        return Decimal('0') 