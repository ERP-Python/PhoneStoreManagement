# Start Django Server with VNPay Configuration
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Starting Django Server with VNPay" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Set VNPay environment variables
$env:VNPAY_TMN_CODE = 'XCO6J35O'
$env:VNPAY_HASH_SECRET_KEY = 'QSLJAQXHA0E0NUOPI7XG9O5DVODCGRJD'
$env:VNPAY_PAYMENT_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
$env:VNPAY_RETURN_URL = 'http://localhost:8000/api/payments/vnpay/return/'

Write-Host "VNPay Configuration:" -ForegroundColor Cyan
Write-Host "  TMN Code: $env:VNPAY_TMN_CODE" -ForegroundColor White
Write-Host "  Hash Secret: $env:VNPAY_HASH_SECRET_KEY" -ForegroundColor White
Write-Host ""

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Starting Django server..." -ForegroundColor Green
python manage.py runserver

