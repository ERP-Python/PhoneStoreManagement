from django.db import models
from django.core.validators import MinValueValidator


class Inventory(models.Model):
    """Inventory model to track stock levels"""
    product_variant = models.OneToOneField('catalog.ProductVariant', on_delete=models.PROTECT, related_name='inventory')
    on_hand = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory'
        verbose_name = 'Inventory'
        verbose_name_plural = 'Inventory'

    def __str__(self):
        return f"{self.product_variant} - Stock: {self.on_hand}"


class StockMovement(models.Model):
    """Stock Movement model to track all stock changes"""
    TYPE_CHOICES = [
        ('IN', 'Stock In'),
        ('OUT', 'Stock Out'),
    ]
    
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    product_variant = models.ForeignKey('catalog.ProductVariant', on_delete=models.PROTECT)
    qty = models.IntegerField()
    ref_type = models.CharField(max_length=50)  # e.g., 'StockIn', 'StockOut'
    ref_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stock_movements'
        ordering = ['-created_at']
        verbose_name = 'Stock Movement'
        verbose_name_plural = 'Stock Movements'
        indexes = [
            models.Index(fields=['product_variant', 'type']),
            models.Index(fields=['created_at']),
            models.Index(fields=['ref_type', 'ref_id']),
        ]

    def __str__(self):
        return f"{self.get_type_display()} - {self.product_variant} - {self.qty}" 