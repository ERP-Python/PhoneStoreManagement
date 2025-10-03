@echo off
echo ================================================
echo 📱 Phone Store Management System - Setup Script
echo ================================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo ✨ Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo ⚙️  Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env with your actual configuration!
    echo    Especially: SECRET_KEY, DB_PASSWORD, VNPAY credentials
    echo.
)

REM Generate secret key
echo 🔐 Generating Django SECRET_KEY...
for /f "delims=" %%i in ('python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"') do set SECRET_KEY=%%i
echo Your generated SECRET_KEY: %SECRET_KEY%
echo Please add this to your .env file
echo.

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "media" mkdir media
if not exist "staticfiles" mkdir staticfiles
if not exist "logs" mkdir logs

REM Database setup
echo 💾 Setting up database...
set /p REPLY="Do you want to run migrations now? (y/n) "
if /i "%REPLY%"=="y" (
    echo 🔧 Creating migrations...
    python manage.py makemigrations
    
    echo 🔧 Running migrations...
    python manage.py migrate
    
    echo 👤 Creating superuser...
    python manage.py createsuperuser
    
    echo 📊 Creating default groups...
    python manage.py shell -c "from django.contrib.auth.models import Group; Group.objects.get_or_create(name='Admin'); Group.objects.get_or_create(name='Staff'); print('Groups created successfully!')"
)

REM Collect static files
echo 📦 Collecting static files...
python manage.py collectstatic --noinput

echo.
echo ================================================
echo ✅ Setup completed successfully!
echo ================================================
echo.
echo Next steps:
echo 1. Update .env file with your configuration
echo 2. Make sure MySQL is running and database is created
echo 3. Run: python manage.py runserver
echo 4. Visit: http://localhost:8000/admin/
echo.
echo Happy coding! 🚀
pause 