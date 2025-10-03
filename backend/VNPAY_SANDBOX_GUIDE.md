# Hướng dẫn sử dụng VNPAY Sandbox

## Cấu hình VNPAY Sandbox

### 1. Tạo file .env
Tạo file `.env` trong thư mục gốc với nội dung:

```env
# VNPay Sandbox Configuration
VNPAY_TMN_CODE=2QXUI4J4
VNPAY_HASH_SECRET=RAOEXHYVSDDIIENYWSLDCCCOHCFYREOU
VNPAY_RETURN_URL=http://localhost:8000/api/payments/vnpay/return/
VNPAY_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

### 2. Cài đặt dependencies
```bash
pip install python-dotenv
```

## API Endpoints

### 1. Tạo thanh toán VNPAY
```
POST /api/orders/{order_id}/create_vnpay_payment/
```

**Request Body:**
```json
{
    "bank_code": "NCB"  // Optional - mã ngân hàng cụ thể
}
```

**Response:**
```json
{
    "payment_id": 123,
    "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "order_code": "ORD-001",
    "amount": 1000000,
    "is_sandbox": true,
    "bank_code": "NCB"
}
```

### 2. Lấy danh sách ngân hàng hỗ trợ
```
GET /api/orders/vnpay_banks/
```

**Response:**
```json
{
    "banks": {
        "NCB": "Ngân hàng Quốc Dân (NCB)",
        "AGRIBANK": "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
        ...
    },
    "is_sandbox": true
}
```

### 3. Lấy phương thức thanh toán
```
GET /api/orders/vnpay_payment_methods/
```

**Response:**
```json
{
    "methods": {
        "vnpay": "Thanh toán qua VNPay",
        "atm": "Thẻ ATM nội địa",
        "credit": "Thẻ Credit/Debit",
        "qr": "Thanh toán QR Code",
        "bank_transfer": "Chuyển khoản ngân hàng"
    },
    "is_sandbox": true
}
```

### 4. Cấu hình VNPAY
```
GET /api/payments/vnpay/config/
```

**Response:**
```json
{
    "is_sandbox": true,
    "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "return_url": "http://localhost:8000/api/payments/vnpay/return/",
    "banks": {...},
    "payment_methods": {...}
}
```

## Callback URLs

### 1. Return URL (User redirect)
```
GET /api/payments/vnpay/return/
```
Được gọi khi user hoàn thành thanh toán trên VNPAY và được redirect về.

### 2. IPN URL (Server-to-server)
```
POST /api/payments/vnpay/ipn/
```
Được VNPAY gọi để thông báo kết quả thanh toán.

## Test Cards (Sandbox)

### Thẻ ATM nội địa
- **Số thẻ:** 9704198526191432198
- **Ngày hết hạn:** 07/15
- **CVV:** 123
- **Tên chủ thẻ:** NGUYEN VAN A
- **OTP:** 123456

### Thẻ Credit/Debit quốc tế
- **Số thẻ:** 4111111111111111
- **Ngày hết hạn:** 07/15
- **CVV:** 123
- **Tên chủ thẻ:** NGUYEN VAN A

## Quy trình thanh toán

1. **Tạo đơn hàng** - Tạo order với status 'pending'
2. **Tạo thanh toán** - Gọi API tạo VNPAY payment URL
3. **Chuyển hướng** - Redirect user đến VNPAY sandbox
4. **Thanh toán** - User nhập thông tin thẻ test
5. **Callback** - VNPAY gọi return URL và IPN URL
6. **Cập nhật** - Hệ thống cập nhật trạng thái order thành 'paid'

## Lưu ý quan trọng

1. **Sandbox Mode:** Hệ thống tự động phát hiện sandbox mode qua URL
2. **Logging:** Tất cả hoạt động VNPAY được ghi log
3. **Security:** Hash được tạo bằng HMAC SHA512
4. **Error Handling:** Có xử lý lỗi đầy đủ cho mọi trường hợp
5. **Testing:** Sử dụng thẻ test để kiểm tra các trường hợp thành công/thất bại

## Troubleshooting

### Lỗi thường gặp:

1. **"VNPay configuration is incomplete"**
   - Kiểm tra file .env có đầy đủ thông số VNPAY
   - Restart server sau khi thay đổi .env

2. **"Order not found"**
   - Kiểm tra order_code có đúng không
   - Kiểm tra order có tồn tại trong database

3. **"Payment failed"**
   - Kiểm tra response_code từ VNPAY
   - Kiểm tra hash validation
   - Xem log để biết chi tiết lỗi

### Debug:
- Kiểm tra file `logs/django.log` để xem chi tiết
- Sử dụng VNPAY sandbox để test trước khi deploy production
```

Tôi đã hoàn thành việc tích hợp VNPAY sandbox vào hệ thống thanh toán của bạn. Dưới đây là tóm tắt những gì đã được cập nhật:

## Những thay đổi chính:

### 1. **File .env** - Cấu hình VNPAY Sandbox
- Thông tin sandbox: TMN Code, Hash Secret
- URL sandbox: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
- Return URL cho callback

### 2. **Cập nhật VNPayService** (`apps/sales/vnpay.py`)
- Hỗ trợ bank code cho thanh toán trực tiếp
- Thêm danh sách ngân hàng hỗ trợ
- Thêm phương thức thanh toán
- Phát hiện sandbox mode
- Cải thiện error handling và logging

### 3. **Cập nhật Views** (`apps/sales/views.py`)
- API tạo thanh toán VNPAY với bank code
- API lấy danh sách ngân hàng
- API lấy phương thức thanh toán
- Cải thiện callback handling
- Thêm logging chi tiết

### 4. **Cập nhật URLs** (`apps/sales/urls/payments.py`)
- Thêm endpoint cấu hình VNPAY
- Cải thiện routing

### 5. **Hướng dẫn sử dụng** (`VNPAY_SANDBOX_GUIDE.md`)
- Hướng dẫn cấu hình chi tiết
- Danh sách API endpoints
- Thẻ test để kiểm tra
- Quy trình thanh toán
- Troubleshooting

## Cách sử dụng:

1. **Tạo file .env** với cấu hình VNPAY sandbox
2. **Restart server** để load cấu hình mới
3. **Tạo đơn hàng** với status 'pending'
4. **Gọi API** tạo thanh toán VNPAY
5. **Redirect user** đến URL thanh toán
6. **Sử dụng thẻ test** để thanh toán
7. **Kiểm tra callback** và cập nhật trạng thái

Hệ thống đã sẵn sàng để test với VNPAY sandbox! Bạn có thể bắt đầu test ngay bằng cách tạo đơn hàng và sử dụng các API mới.
