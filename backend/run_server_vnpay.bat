@echo off
echo ========================================
echo   Starting Django Server with VNPay
echo ========================================
echo.

REM Set VNPay environment variables
set VNPAY_TMN_CODE=XCO6J35O
set VNPAY_HASH_SECRET_KEY=QSLJAQXHA0E0NUOPI7XG9O5DVODCGRJD
set VNPAY_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
set VNPAY_RETURN_URL=http://localhost:8000/api/payments/vnpay/return/

echo VNPay Configuration:
echo   TMN Code: %VNPAY_TMN_CODE%
echo   Hash Secret: %VNPAY_HASH_SECRET_KEY%
echo.

cd /d "%~dp0"

echo Starting Django server...
python manage.py runserver

pause

