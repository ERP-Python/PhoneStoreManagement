from rest_framework import serializers
from .models import Brand, Product, ProductVariant, ProductImage, Imei


class BrandSerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'description', 'logo', 'is_active', 
                  'products_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'logo']

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()
    
    def get_logo(self, obj):
        """Get logo URL from file system"""
        return obj.logo_url
    
    def create(self, validated_data):
        # Auto-generate slug from name if not provided
        if 'slug' not in validated_data or not validated_data.get('slug'):
            from django.utils.text import slugify
            validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Auto-update slug if name changes
        if 'name' in validated_data and validated_data['name'] != instance.name:
            from django.utils.text import slugify
            validated_data['slug'] = slugify(validated_data['name'])
        return super().update(instance, validated_data)


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'sort_order', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductVariantSerializer(serializers.ModelSerializer):
    current_stock = serializers.ReadOnlyField()
    product_detail = serializers.SerializerMethodField(read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'product_detail', 'ram', 'rom', 'color', 'sku', 
                  'price', 'is_active', 'current_stock', 'images', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'product_detail', 'images']
    
    def get_product_detail(self, obj):
        brand_data = None
        if obj.product.brand:
            brand_data = {
                'id': obj.product.brand.id,
                'name': obj.product.brand.name
            }
        return {
            'id': obj.product.id,
            'name': obj.product.name,
            'sku': obj.product.sku,
            'brand': brand_data
        }
    
    def get_images(self, obj):
        """Generate image URLs based on file system structure"""
        import os
        from django.conf import settings
        
        images = []
        # Path: products/{product_id}/{variant_id}/
        variant_folder = os.path.join(
            settings.BASE_DIR,
            'apps', 'assets', 'images', 'products',
            str(obj.product.id),
            str(obj.id)
        )
        
        if os.path.exists(variant_folder):
            # Get all .jpg files and sort them
            image_files = sorted([f for f in os.listdir(variant_folder) if f.endswith('.jpg')])
            for img_file in image_files:
                images.append({
                    'id': f"{obj.product.id}_{obj.id}_{img_file}",
                    'image': f'/assets/images/products/{obj.product.id}/{obj.id}/{img_file}',
                    'is_primary': img_file == '1.jpg',
                    'sort_order': int(img_file.split('.')[0]) if img_file.split('.')[0].isdigit() else 0
                })
        
        return images


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
        """Get the first image from the first active variant"""
        import os
        from django.conf import settings
        
        # Get first active variant
        first_variant = obj.variants.filter(is_active=True).first()
        if not first_variant:
            # Fallback to any variant
            first_variant = obj.variants.first()
        
        if first_variant:
            # Path: products/{product_id}/{variant_id}/1.jpg
            image_path = f'/assets/images/products/{obj.id}/{first_variant.id}/1.jpg'
            variant_folder = os.path.join(
                settings.BASE_DIR,
                'apps', 'assets', 'images', 'products',
                str(obj.id),
                str(first_variant.id)
            )
            
            # Check if the image file exists
            if os.path.exists(os.path.join(variant_folder, '1.jpg')):
                return {
                    'id': f"{obj.id}_{first_variant.id}_1",
                    'image': image_path,
                    'is_primary': True,
                    'sort_order': 0,
                    'created_at': obj.created_at
                }
        
        # Fallback to default image
        return {
            'id': None,
            'image': '/assets/images/1.jpg',
            'is_primary': True,
            'sort_order': 0,
            'created_at': obj.created_at
        }
    
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