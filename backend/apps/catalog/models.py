from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal


class Brand(models.Model):
    """Brand model"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'brands'
        ordering = ['name']
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'

    def __str__(self):
        return self.name


class Product(models.Model):
    """Product model"""
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True, db_index=True)
    barcode = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name='products')
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['barcode']),
            models.Index(fields=['brand', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku})"


class ProductVariant(models.Model):
    """Product Variant model for RAM/ROM/Color combinations"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    ram = models.CharField(max_length=20, blank=True, null=True)  # e.g., "8GB", "12GB"
    rom = models.CharField(max_length=20, blank=True, null=True)  # e.g., "128GB", "256GB"
    color = models.CharField(max_length=50, blank=True, null=True)
    sku = models.CharField(max_length=50, unique=True, db_index=True)
    price = models.DecimalField(max_digits=12, decimal_places=0, validators=[MinValueValidator(Decimal('0'))])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'product_variants'
        ordering = ['product', 'ram', 'rom', 'color']
        verbose_name = 'Product Variant'
        verbose_name_plural = 'Product Variants'
        unique_together = [['product', 'ram', 'rom', 'color']]
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['product', 'is_active']),
        ]

    def __str__(self):
        parts = [self.product.name]
        if self.ram:
            parts.append(self.ram)
        if self.rom:
            parts.append(self.rom)
        if self.color:
            parts.append(self.color)
        return ' - '.join(parts)

    @property
    def current_stock(self):
        """Get current stock from inventory"""
        from apps.inventory.models import Inventory
        try:
            inventory = Inventory.objects.get(product_variant=self)
            return inventory.on_hand
        except Inventory.DoesNotExist:
            return 0


class ProductImage(models.Model):
    """Product Image model"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product_images'
        ordering = ['-is_primary', 'sort_order', 'created_at']
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'

    def __str__(self):
        return f"Image for {self.product.name}"

    def save(self, *args, **kwargs):
        # If this image is set as primary, unset other primary images
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)


class Imei(models.Model):
    """IMEI tracking model (optional feature)"""
    STATUS_CHOICES = [
        ('in_stock', 'In Stock'),
        ('sold', 'Sold'),
        ('reserved', 'Reserved'),
    ]
    
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, related_name='imeis')
    imei = models.CharField(max_length=20, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_stock')
    stock_in_item = models.ForeignKey('procurement.StockInItem', on_delete=models.SET_NULL, null=True, blank=True)
    stock_out_item = models.ForeignKey('sales.StockOutItem', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'imeis'
        ordering = ['created_at']
        verbose_name = 'IMEI'
        verbose_name_plural = 'IMEIs'
        indexes = [
            models.Index(fields=['imei']),
            models.Index(fields=['product_variant', 'status']),
        ]

    def __str__(self):
        return f"{self.imei} - {self.product_variant}" 