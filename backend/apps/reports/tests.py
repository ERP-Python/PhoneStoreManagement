"""
Test suite for recent_activities endpoint
Run with: python manage.py test apps.reports.tests.TestRecentActivities
"""
from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from apps.sales.models import Order
from apps.inventory.models import Inventory
from apps.customers.models import Customer
from apps.catalog.models import Product, Brand, ProductVariant


class TestRecentActivities(TestCase):
    """Test recent_activities API endpoint"""
    
    def setUp(self):
        """Set up test data"""
        # Create test brand and product
        self.brand = Brand.objects.create(
            name='Test Brand',
            code='TEST'
        )
        
        self.product = Product.objects.create(
            name='Test iPhone 15',
            code='IPHONE15',
            brand=self.brand
        )
        
        self.product_variant = ProductVariant.objects.create(
            product=self.product,
            sku='IPHONE15-BLK-128',
            price=1000000
        )
        
        # Create test inventory
        self.inventory = Inventory.objects.create(
            product_variant=self.product_variant,
            on_hand=5  # Low stock
        )
    
    def test_inventory_fields_exist(self):
        """Test that Inventory has correct fields"""
        inv = self.inventory
        
        # ✅ Should have on_hand field
        self.assertTrue(hasattr(inv, 'on_hand'))
        self.assertEqual(inv.on_hand, 5)
        
        # ✅ Should NOT have quantity field
        self.assertFalse(hasattr(inv, 'quantity'))
        
        # ✅ Should have updated_at field
        self.assertTrue(hasattr(inv, 'updated_at'))
    
    def test_inventory_relationship(self):
        """Test that Inventory relates to Product via ProductVariant"""
        inv = self.inventory
        
        # ✅ Should access product via product_variant
        self.assertEqual(
            inv.product_variant.product.name,
            'Test iPhone 15'
        )
    
    def test_low_stock_query(self):
        """Test low stock query works with on_hand field"""
        # Create another high-stock inventory
        pv2 = ProductVariant.objects.create(
            product=self.product,
            sku='IPHONE15-RED-128',
            price=1000000
        )
        Inventory.objects.create(
            product_variant=pv2,
            on_hand=100  # High stock
        )
        
        # Query low stock
        low_stock = Inventory.objects.filter(on_hand__lt=10)
        
        # ✅ Should find our low stock item
        self.assertEqual(low_stock.count(), 1)
        self.assertEqual(low_stock.first().on_hand, 5)
    
    def test_activity_action_string(self):
        """Test that activity action string can be built correctly"""
        inv = self.inventory
        
        # ✅ This should work without errors
        action = f'Sản phẩm "{inv.product_variant.product.name}" sắp hết hàng ({inv.on_hand} cái)'
        
        self.assertEqual(
            action,
            'Sản phẩm "Test iPhone 15" sắp hết hàng (5 cái)'
        )
    
    def test_order_paid_status(self):
        """Test that Order has 'paid' status"""
        customer = Customer.objects.create(
            name='Test Customer',
            phone='0123456789'
        )
        
        order = Order.objects.create(
            code='ORD-001',
            customer=customer,
            status='paid',
            total=5000000
        )
        
        # ✅ Should be able to filter by paid status
        paid_orders = Order.objects.filter(status='paid')
        self.assertEqual(paid_orders.count(), 1)
        self.assertEqual(paid_orders.first().code, 'ORD-001')
    
    def test_customer_created_at(self):
        """Test that Customer has created_at field"""
        customer = Customer.objects.create(
            name='Test Customer 2',
            phone='9876543210'
        )
        
        # ✅ Should have created_at
        self.assertTrue(hasattr(customer, 'created_at'))
        self.assertIsNotNone(customer.created_at)
    
    def test_response_structure(self):
        """Test that API response has correct structure"""
        from rest_framework.test import APIRequestFactory
        from django.contrib.auth.models import User
        from apps.reports.views import recent_activities
        
        # Create test user
        user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        
        # Create fake request
        factory = APIRequestFactory()
        request = factory.get('/reports/recent-activities/')
        request.user = user
        
        # Call view
        response = recent_activities(request)
        
        # ✅ Should return 200
        self.assertEqual(response.status_code, 200)
        
        # ✅ Response should be a list
        self.assertIsInstance(response.data, list)
        
        # ✅ If activities exist, should have required fields
        if response.data:
            for activity in response.data:
                self.assertIn('type', activity)
                self.assertIn('action', activity)
                self.assertIn('time', activity)
                
                # ✅ type should be one of valid types
                self.assertIn(activity['type'], ['order', 'low_stock', 'customer'])


if __name__ == '__main__':
    import django
    django.setup()
    
    # Run tests
    from django.test.utils import get_runner
    from django.conf import settings
    
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    failures = test_runner.run_tests(['apps.reports.tests'])
