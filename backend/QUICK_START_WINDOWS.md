# ⚡ Quick Start - Windows (MySQL Local)

## 1️⃣ Cài MySQL

**XAMPP (Dễ nhất)**:
- Download: https://www.apachefriends.org/
- Install → Start MySQL từ Control Panel

**Hoặc MySQL Standalone**:
- Download: https://dev.mysql.com/downloads/installer/
- Install với root password (hoặc không password)

## 2️⃣ Tạo Database

```bash
# Mở MySQL (từ XAMPP hoặc MySQL Workbench)
CREATE DATABASE phone_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 3️⃣ Setup Backend

```bash
cd backend

# Tạo & activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Chỉnh file .env (đã có sẵn):
# - DB_PASSWORD= (để trống nếu MySQL không có password)

# Tạo thư mục
mkdir media logs

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Tạo admin user
python manage.py createsuperuser

# Collect static
python manage.py collectstatic --noinput

# RUN!
python manage.py runserver
```

## 4️⃣ Test

✅ API: http://localhost:8000/api/health/  
✅ Admin: http://localhost:8000/admin/  

## 5️⃣ Hình ảnh

Hình ảnh tự động lưu tại: `backend\media\`

Upload qua:
- Admin panel: http://localhost:8000/admin/
- API: POST `/api/products/{id}/images/`

## 🐛 Lỗi thường gặp

**"Can't connect to MySQL"**:
```bash
# Check MySQL đang chạy
# XAMPP: Control Panel → MySQL Status
# Hoặc: services.msc → MySQL80
```

**"No module named MySQLdb"**:
```bash
pip uninstall mysqlclient
pip install mysqlclient
```

**Nếu vẫn lỗi mysqlclient**:
- Download wheel: https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient
- Install: `pip install mysqlclient-xxx.whl`

## ✅ Done!

Backend: http://localhost:8000  
Media files: `D:\projectERP\DT\backend\media\`

Xem chi tiết: **SETUP_LOCAL_GUIDE.md** 