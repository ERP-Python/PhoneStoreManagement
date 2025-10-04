# 📱 Hệ thống Quản lý Cửa hàng Điện thoại

Hệ thống quản lý toàn diện cho cửa hàng điện thoại với Django REST Framework backend và React frontend.

## 🎯 Tính năng chính

### ✅ Đã triển khai
- **Authentication & Authorization**: Django session-based auth với RBAC (Admin/Staff)
- **Catalog Management**: Brand, Product, Variant, Images
- **Procurement**: Supplier, Purchase Order, Stock In
- **Inventory**: Real-time stock tracking, Stock Movements
- **Customer Management**: CRM đơn giản cho khách hàng nội bộ
- **Sales & Orders**: Tạo đơn hàng, quản lý trạng thái
- **Payment Integration**: VNPay payment gateway
- **Reports**: Dashboard và báo cáo doanh thu

### 🔧 Công nghệ sử dụng

**Backend:**
- Django 4.2.7
- Django REST Framework 3.14.0
- MySQL 8.0
- Python 3.10+

**Frontend (Cần triển khai):**
- React 18
- React Router
- Axios
- TailwindCSS / Material-UI

**DevOps:**
- Docker & Docker Compose
- Nginx
- Gunicorn

## 📁 Cấu trúc Project

```
DT/
├── backend/
│   ├── apps/
│   │   ├── users/          # Quản lý người dùng & phân quyền
│   │   ├── catalog/        # Sản phẩm, Brand, Variant
│   │   ├── procurement/    # Nhà cung cấp, PO, Nhập kho
│   │   ├── inventory/      # Tồn kho, Stock movements
│   │   ├── customers/      # Quản lý khách hàng
│   │   ├── sales/          # Đơn hàng, Thanh toán, Xuất kho
│   │   ├── reports/        # Báo cáo & thống kê
│   │   └── core/           # Cấu hình hệ thống
│   ├── config/             # Django settings
│   ├── media/              # User uploads
│   ├── staticfiles/        # Static files
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # React app (Cần triển khai)
├── docker-compose.yml
├── huongdan.md            # Đặc tả chi tiết
└── README.md

## 🚀 Hướng dẫn Setup

### Bước 1: Clone & Setup môi trường

```bash
# Clone repository
git clone <repo-url>
cd DT

# Tạo virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Bước 2: Cấu hình Database

```bash
# Tạo database MySQL
mysql -u root -p
CREATE DATABASE phone_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'phone_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON phone_store.* TO 'phone_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Bước 3: Cấu hình Environment

```bash
# Copy file .env.example
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
# - SECRET_KEY: Generate Django secret key
# - DB_PASSWORD: MySQL password
# - VNPAY_TMN_CODE, VNPAY_HASH_SECRET: VNPay credentials
```

**Generate SECRET_KEY:**
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Bước 4: Run Migrations

```bash
# Tạo migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Tạo superuser
python manage.py createsuperuser

# Tạo nhóm phân quyền (Optional - tạo script)
python manage.py shell
>>> from django.contrib.auth.models import Group
>>> Group.objects.create(name='Admin')
>>> Group.objects.create(name='Staff')
>>> exit()
```

### Bước 5: Collect Static Files

```bash
python manage.py collectstatic --noinput
```

### Bước 6: Run Development Server

```bash
python manage.py runserver
```

Truy cập:
- **API**: http://localhost:8000/api/
- **Admin**: http://localhost:8000/admin/

## 🐳 Deploy với Docker

```bash
# Build and run
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Stop
docker-compose down

# Clean up (including volumes)
docker-compose down -v
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Current user info
- `GET /api/auth/csrf/` - Get CSRF token

### Users & Groups (Admin only)
- `GET/POST /api/auth/users/` - User management
- `GET/POST /api/auth/groups/` - Group management

### Catalog
- `GET/POST/PUT/DELETE /api/brands/` - Brand CRUD
- `GET/POST/PUT/DELETE /api/products/` - Product CRUD
- `GET/POST/PUT/DELETE /api/products/variants/` - Variant CRUD
- `GET/POST/DELETE /api/products/images/` - Product images

### Procurement
- `GET/POST/PUT/DELETE /api/suppliers/` - Supplier CRUD
- `GET/POST/PUT/DELETE /api/purchase-orders/` - PO CRUD
- `POST /api/purchase-orders/{id}/approve/` - Approve PO
- `GET/POST /api/stock-in/` - Stock In CRUD

### Inventory
- `GET /api/inventory/` - View inventory
- `GET /api/inventory/movements/` - Stock movements

### Customers
- `GET/POST/PUT/DELETE /api/customers/` - Customer CRUD

### Sales & Orders
- `GET/POST /api/orders/` - Order management
- `POST /api/orders/{id}/vnpay/create/` - Create VNPay payment
- `POST /api/payments/vnpay/callback/` - VNPay callback (webhook)
- `POST /api/orders/{id}/fulfill/` - Create StockOut
- `GET /api/orders/{id}/invoice/` - Invoice PDF

### Reports
- `GET /api/reports/sales/` - Sales report
- `GET /api/reports/inventory/` - Inventory report
- `GET /api/reports/top-products/` - Top products

## 🔐 Phân quyền

### Admin
- Toàn quyền hệ thống
- Quản lý users, permissions
- Duyệt Purchase Orders
- Xem tất cả báo cáo

### Staff
- Tạo/sửa sản phẩm
- Tạo đơn hàng
- Nhập/xuất kho (theo phân công)
- Xem báo cáo giới hạn

## 📊 Database Schema

Tham khảo file `huongdan.md` section 4 để xem chi tiết database schema.

**Các bảng chính:**
- `brands`, `products`, `product_variants`, `product_images`, `imeis`
- `suppliers`, `purchase_orders`, `po_items`
- `stock_ins`, `stock_in_items`
- `inventory`, `stock_movements`
- `customers`
- `orders`, `order_items`, `payments`
- `stock_outs`, `stock_out_items`

## 🔧 Cần triển khai tiếp

### Backend (Ưu tiên cao)
1. **Views & Serializers cho các modules còn lại:**
   - Procurement (Supplier, PO, Stock In views)
   - Inventory views
   - Customers views
   - Sales views (Order, Payment, Stock Out)
   - Reports views

2. **Business Logic:**
   - Stock In signal để tự động tăng inventory
   - Stock Out signal để tự động giảm inventory
   - Order calculation logic
   - VNPay callback handler
   - Invoice PDF generation

3. **Admin Interface:**
   - Register models vào Django admin
   - Custom admin actions

4. **Testing:**
   - Unit tests
   - Integration tests
   - API endpoint tests

### Frontend (Cần triển khai từ đầu)
1. **Setup React project**
2. **Authentication & Layout**
3. **Dashboard**
4. **Product Management pages**
5. **Order Management pages**
6. **Reports pages**

## 🎨 Frontend Stack đề xuất

```bash
# Tạo React app
npx create-react-app frontend
cd frontend

# Install dependencies
npm install react-router-dom axios
npm install @mui/material @emotion/react @emotion/styled
# hoặc
npm install tailwindcss
```

## 📖 Hướng dẫn phát triển

### Thêm model mới
1. Định nghĩa model trong `apps/<app>/models.py`
2. Tạo migration: `python manage.py makemigrations`
3. Apply migration: `python manage.py migrate`
4. Tạo serializer trong `apps/<app>/serializers.py`
5. Tạo viewset trong `apps/<app>/views.py`
6. Register URL trong `apps/<app>/urls.py`

### Debug tips
```python
# Django shell
python manage.py shell

# Test queries
from apps.catalog.models import Product
Product.objects.all()

# Check migrations
python manage.py showmigrations

# Create test data
python manage.py loaddata fixtures/sample_data.json
```

## 🐛 Troubleshooting

### MySQL connection error
- Kiểm tra MySQL service đang chạy
- Verify credentials trong `.env`
- Check MySQL port (default: 3306)

### Migration conflicts
```bash
python manage.py migrate --fake-initial
# hoặc
python manage.py migrate <app_name> --fake
```

### Static files không load
```bash
python manage.py collectstatic --clear
python manage.py collectstatic
```

## 📞 Liên hệ & Support

- **Documentation**: Xem file `huongdan.md` để biết đặc tả chi tiết
- **Issues**: Tạo issue trên GitHub
- **Email**: your-email@example.com

## 📄 License

MIT License - Tự do sử dụng cho mục đích thương mại và cá nhân.

---

**Note**: Project này được xây dựng theo đặc tả trong file `huongdan.md`. Vui lòng đọc kỹ để hiểu đầy đủ requirements và scope. 