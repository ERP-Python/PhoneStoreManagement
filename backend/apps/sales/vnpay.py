"""
VNPay Payment Gateway Integration
"""
import hashlib
import hmac
import urllib.parse
from datetime import datetime
from django.conf import settings


class VNPayService:
    """VNPay payment service"""
    
    def __init__(self):
        self.vnp_tmn_code = settings.VNPAY_TMN_CODE
        self.vnp_hash_secret = settings.VNPAY_HASH_SECRET
        self.vnp_payment_url = settings.VNPAY_PAYMENT_URL
        self.vnp_return_url = settings.VNPAY_RETURN_URL
    
    def create_payment_url(self, order_code, amount, order_desc, ip_addr):
        """
        Create VNPay payment URL
        
        Args:
            order_code: Order code
            amount: Payment amount (VND)
            order_desc: Order description
            ip_addr: Client IP address
            
        Returns:
            Payment URL string
        """
        # VNPay parameters
        vnp_params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': self.vnp_tmn_code,
            'vnp_Amount': int(amount * 100),  # VNPay requires amount * 100
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': order_code,
            'vnp_OrderInfo': order_desc,
            'vnp_OrderType': 'other',
            'vnp_Locale': 'vn',
            'vnp_ReturnUrl': self.vnp_return_url,
            'vnp_IpAddr': ip_addr,
            'vnp_CreateDate': datetime.now().strftime('%Y%m%d%H%M%S'),
        }
        
        # Sort and create query string
        sorted_params = sorted(vnp_params.items())
        query_string = '&'.join([f"{key}={urllib.parse.quote_plus(str(value))}" for key, value in sorted_params])
        
        # Create secure hash
        secure_hash = self._create_secure_hash(query_string)
        
        # Final payment URL
        payment_url = f"{self.vnp_payment_url}?{query_string}&vnp_SecureHash={secure_hash}"
        
        return payment_url
    
    def validate_response(self, response_data):
        """
        Validate VNPay callback response
        
        Args:
            response_data: Dictionary of VNPay response parameters
            
        Returns:
            Tuple (is_valid, txn_code, amount, order_code)
        """
        vnp_secure_hash = response_data.get('vnp_SecureHash', '')
        
        # Remove secure hash from params for validation
        params = {k: v for k, v in response_data.items() if k != 'vnp_SecureHash' and k != 'vnp_SecureHashType'}
        
        # Sort and create query string
        sorted_params = sorted(params.items())
        query_string = '&'.join([f"{key}={urllib.parse.quote_plus(str(value))}" for key, value in sorted_params])
        
        # Create secure hash
        calculated_hash = self._create_secure_hash(query_string)
        
        # Validate
        is_valid = calculated_hash == vnp_secure_hash
        
        # Extract transaction info
        txn_code = response_data.get('vnp_TransactionNo', '')
        amount = int(response_data.get('vnp_Amount', 0)) / 100  # Convert back from VNPay format
        order_code = response_data.get('vnp_TxnRef', '')
        response_code = response_data.get('vnp_ResponseCode', '')
        
        # Check if payment was successful (response code 00 means success)
        is_success = is_valid and response_code == '00'
        
        return is_success, txn_code, amount, order_code, response_data
    
    def _create_secure_hash(self, query_string):
        """
        Create HMAC SHA512 secure hash
        
        Args:
            query_string: Query string to hash
            
        Returns:
            Hex string of hash
        """
        return hmac.new(
            self.vnp_hash_secret.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha512
        ).hexdigest() 