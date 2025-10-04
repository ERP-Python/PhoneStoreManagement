from django.contrib import admin
from .models import Brand, Product, ProductVariant, ProductImage, Imei


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'sku', 'brand', 'is_active', 'created_at']
    list_filter = ['brand', 'is_active', 'created_at']
    search_fields = ['name', 'sku', 'barcode']
    
    inlines = [ProductVariantInline, ProductImageInline]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'sku', 'price', 'current_stock', 'is_active']
    list_filter = ['product__brand', 'is_active']
    search_fields = ['sku', 'product__name']


@admin.register(Imei)
class ImeiAdmin(admin.ModelAdmin):
    list_display = ['imei', 'product_variant', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['imei', 'product_variant__product__name'] 