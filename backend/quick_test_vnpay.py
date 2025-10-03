import os
import sys
import django

# Setup Django
sys.path.insert(0, r'D:\Bai Tap Tren Lop\chuyendecongnghe\backup\phonemanagement\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.sales.vnpay import VNPayService

print('Testing VNPay Configuration...')
print('=' * 80)

vnpay = VNPayService()

print('\nCreating test payment URL...')
test_url = vnpay.create_payment_url(
    order_code='TEST-001',
    amount=100000,
    order_desc='Test payment',
    ip_addr='127.0.0.1'
)

print(f'\nTest URL length: {len(test_url)}')
print(f'Contains vnp_TmnCode=XCO6J35O: {"vnp_TmnCode=XCO6J35O" in test_url}')
print(f'Is sandbox: {vnpay.is_sandbox_mode()}')
