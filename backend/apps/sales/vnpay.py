"""
VNPay Payment Gateway Integration - Sandbox Support
"""
import hashlib
import hmac
import urllib.parse
import logging
from datetime import datetime
from django.conf import settings

logger = logging.getLogger(__name__)


class VNPayService:
    """VNPay payment service with sandbox support"""
    
    def __init__(self):
        self.vnp_tmn_code = settings.VNPAY_TMN_CODE
        self.vnp_hash_secret = settings.VNPAY_HASH_SECRET
        self.vnp_payment_url = settings.VNPAY_PAYMENT_URL
        self.vnp_return_url = settings.VNPAY_RETURN_URL
        
        # Validate configuration
        if not all([self.vnp_tmn_code, self.vnp_hash_secret, self.vnp_payment_url, self.vnp_return_url]):
            logger.warning("VNPay configuration is incomplete. Please check your environment variables.")
    
    def create_payment_url(self, order_code, amount, order_desc, ip_addr, bank_code=None, card_type=None):
        """
        Create VNPay payment URL
        
        Args:
            order_code: Order code
            amount: Payment amount (VND)
            order_desc: Order description
            ip_addr: Client IP address
            bank_code: Bank code for direct payment (optional)
            card_type: Card type (optional)
            
        Returns:
            Payment URL string
        """
        try:
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
            
            # Add bank code if specified
            if bank_code:
                vnp_params['vnp_BankCode'] = bank_code
            
            # Add card type if specified
            if card_type:
                vnp_params['vnp_CardType'] = card_type
            
            # Sort and create query string - VNPAY specific format
            sorted_params = sorted(vnp_params.items())
            query_string = '&'.join([f"{key}={value}" for key, value in sorted_params])
            
            # Create secure hash
            secure_hash = self._create_secure_hash(query_string)
            
            # Final payment URL
            payment_url = f"{self.vnp_payment_url}?{query_string}&vnp_SecureHash={secure_hash}"
            
            logger.info(f"Created VNPay payment URL for order {order_code}")
            logger.info(f"Query string: {query_string}")
            logger.info(f"Secure hash: {secure_hash}")
            
            return payment_url
            
        except Exception as e:
            logger.error(f"Error creating VNPay payment URL: {str(e)}")
            raise
    
    def validate_response(self, response_data):
        """
        Validate VNPay callback response
        
        Args:
            response_data: Dictionary of VNPay response parameters
            
        Returns:
            Tuple (is_success, txn_code, amount, order_code, response_data)
        """
        try:
            vnp_secure_hash = response_data.get('vnp_SecureHash', '')
            
            # Remove secure hash from params for validation
            params = {k: v for k, v in response_data.items() if k != 'vnp_SecureHash' and k != 'vnp_SecureHashType'}
            
            # Sort and create query string - VNPAY specific format
            sorted_params = sorted(params.items())
            query_string = '&'.join([f"{key}={value}" for key, value in sorted_params])
            
            # Create secure hash
            calculated_hash = self._create_secure_hash(query_string)
            
            # Validate
            is_valid = calculated_hash == vnp_secure_hash
            
            # Extract transaction info
            txn_code = response_data.get('vnp_TransactionNo', '')
            amount = int(response_data.get('vnp_Amount', 0)) / 100  # Convert back from VNPay format
            order_code = response_data.get('vnp_TxnRef', '')
            response_code = response_data.get('vnp_ResponseCode', '')
            bank_code = response_data.get('vnp_BankCode', '')
            card_type = response_data.get('vnp_CardType', '')
            pay_date = response_data.get('vnp_PayDate', '')
            
            # Check if payment was successful (response code 00 means success)
            is_success = is_valid and response_code == '00'
            
            logger.info(f"VNPay response validation - Order: {order_code}, Success: {is_success}, Response Code: {response_code}")
            logger.info(f"Query string for validation: {query_string}")
            logger.info(f"Calculated hash: {calculated_hash}")
            logger.info(f"Received hash: {vnp_secure_hash}")
            
            # Add additional info to response data
            response_data.update({
                'vnp_txn_ref': order_code,
                'vnp_response_code': response_code,
                'vnp_bank_code': bank_code,
                'vnp_card_type': card_type,
                'vnp_pay_date': pay_date,
            })
            
            return is_success, txn_code, amount, order_code, response_data
            
        except Exception as e:
            logger.error(f"Error validating VNPay response: {str(e)}")
            return False, '', 0, '', response_data
    
    def get_bank_list(self):
        """
        Get list of supported banks for VNPay
        
        Returns:
            Dictionary of bank codes and names
        """
        return {
            'NCB': 'Ngân hàng Quốc Dân (NCB)',
            'AGRIBANK': 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam',
            'SCB': 'Ngân hàng TMCP Sài Gòn (SCB)',
            'SACOMBANK': 'Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)',
            'EXIMBANK': 'Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam (Eximbank)',
            'MSBANK': 'Ngân hàng TMCP Hàng Hải (MSB)',
            'NAMABANK': 'Ngân hàng TMCP Nam Á (NamABank)',
            'OCB': 'Ngân hàng TMCP Phương Đông (OCB)',
            'IVB': 'Ngân hàng TNHH Indovina (IVB)',
            'VIB': 'Ngân hàng TMCP Quốc tế Việt Nam (VIB)',
            'VIETBANK': 'Ngân hàng TMCP Việt Nam Thương Tín (VietBank)',
            'VIETINBANK': 'Ngân hàng TMCP Công thương Việt Nam (VietinBank)',
            'VIETCOMBANK': 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
            'HDBANK': 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh (HDBank)',
            'DONGABANK': 'Ngân hàng TMCP Đông Á (DongABank)',
            'TPBANK': 'Ngân hàng TMCP Tiên Phong (TPBank)',
            'VPBANK': 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
            'ACB': 'Ngân hàng TMCP Á Châu (ACB)',
            'TECHCOMBANK': 'Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)',
            'BIDV': 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
            'MBBANK': 'Ngân hàng TMCP Quân đội (MB)',
            'VCCB': 'Ngân hàng TMCP Bản Việt (VietCapitalBank)',
            'VIETABANK': 'Ngân hàng TMCP Việt Á (VietABank)',
            'ABBANK': 'Ngân hàng TMCP An Bình (ABBank)',
            'BVBANK': 'Ngân hàng TMCP Bảo Việt (BaoVietBank)',
            'GPBANK': 'Ngân hàng TMCP Dầu Khí Toàn Cầu (GPBank)',
            'OCEANBANK': 'Ngân hàng TMCP Đại Dương (OceanBank)',
            'PGBANK': 'Ngân hàng TMCP Xăng dầu Petrolimex (PGBank)',
            'PUBLICBANK': 'Ngân hàng TNHH MTV Public Việt Nam (PublicBank)',
            'SEABANK': 'Ngân hàng TMCP Đông Nam Á (SeABank)',
            'SHB': 'Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)',
        }
    
    def get_payment_methods(self):
        """
        Get available payment methods for VNPay
        
        Returns:
            Dictionary of payment methods
        """
        return {
            'vnpay': 'Thanh toán qua VNPay',
            'atm': 'Thẻ ATM nội địa',
            'credit': 'Thẻ Credit/Debit',
            'qr': 'Thanh toán QR Code',
            'bank_transfer': 'Chuyển khoản ngân hàng',
        }
    
    def get_card_types(self):
        """
        Get available card types for VNPay
        
        Returns:
            Dictionary of card types
        """
        return {
            'ATM': 'Thẻ ATM nội địa',
            'CREDIT': 'Thẻ Credit',
            'DEBIT': 'Thẻ Debit',
            'PREPAID': 'Thẻ Prepaid',
        }
    
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
    
    def is_sandbox_mode(self):
        """
        Check if VNPay is in sandbox mode
        
        Returns:
            Boolean indicating if in sandbox mode
        """
        return 'sandbox' in self.vnp_payment_url.lower()