from rest_framework import serializers
from .models import Brand, Product, ProductVariant, ProductImage, Imei


class BrandSerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'is_active', 
                  'products_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'sort_order', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductVariantSerializer(serializers.ModelSerializer):
    current_stock = serializers.ReadOnlyField()
    product_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'product_detail', 'ram', 'rom', 'color', 'sku', 
                  'price', 'is_active', 'current_stock', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'product_detail']
    
    def get_product_detail(self, obj):
        return {
            'id': obj.product.id,
            'name': obj.product.name,
            'sku': obj.product.sku
        }


class ProductSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    price_range = serializers.SerializerMethodField()
    variants_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'barcode', 'brand', 'brand_name', 
                  'description', 'is_active', 'variants', 'variants_count', 'images', 'primary_image',
                  'price_range', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            return ProductImageSerializer(primary).data
        return None
    
    def get_price_range(self, obj):
        """Get price range from variants"""
        variants = obj.variants.filter(is_active=True)
        if not variants.exists():
            return None
        
        prices = variants.values_list('price', flat=True)
        min_price = min(prices)
        max_price = max(prices)
        
        if min_price == max_price:
            return {
                'min': float(min_price),
                'max': float(max_price),
                'display': f"{int(min_price):,} ₫"
            }
        else:
            return {
                'min': float(min_price),
                'max': float(max_price),
                'display': f"{int(min_price):,} ₫ - {int(max_price):,} ₫"
            }
    
    def get_variants_count(self, obj):
        """Get count of active variants"""
        return obj.variants.filter(is_active=True).count()


class ImeiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imei
        fields = ['id', 'product_variant', 'imei', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at'] 