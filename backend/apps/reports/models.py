from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class RevenueStats(models.Model):
    """Daily revenue statistics model"""
    date = models.DateField(unique=True, db_index=True)
    
    # Total stats
    total_revenue = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    total_orders = models.IntegerField(default=0)
    
    # Payment method breakdown
    cash_revenue = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    vnpay_revenue = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    bank_transfer_revenue = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    
    cash_orders = models.IntegerField(default=0)
    vnpay_orders = models.IntegerField(default=0)
    bank_transfer_orders = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'revenue_stats'
        ordering = ['-date']
        verbose_name = 'Revenue Statistics'
        verbose_name_plural = 'Revenue Statistics'
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Revenue Stats for {self.date}: {self.total_revenue} VND"
    
    @property
    def average_order_value(self):
        """Calculate average order value"""
        if self.total_orders > 0:
            return self.total_revenue / self.total_orders
        return Decimal('0')
    
    def get_method_stats(self):
        """Get payment method breakdown"""
        return {
            'cash': {
                'revenue': self.cash_revenue,
                'orders': self.cash_orders,
                'percentage': float(self.cash_revenue / self.total_revenue * 100) if self.total_revenue > 0 else 0
            },
            'vnpay': {
                'revenue': self.vnpay_revenue,
                'orders': self.vnpay_orders,
                'percentage': float(self.vnpay_revenue / self.total_revenue * 100) if self.total_revenue > 0 else 0
            },
            'bank_transfer': {
                'revenue': self.bank_transfer_revenue,
                'orders': self.bank_transfer_orders,
                'percentage': float(self.bank_transfer_revenue / self.total_revenue * 100) if self.total_revenue > 0 else 0
            }
        } 