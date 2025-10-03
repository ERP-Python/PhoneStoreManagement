#!/bin/bash

echo "================================================"
echo "📱 Phone Store Management System - Setup Script"
echo "================================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "✨ Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual configuration!"
    echo "   Especially: SECRET_KEY, DB_PASSWORD, VNPAY credentials"
    echo ""
fi

# Generate secret key if needed
echo "🔐 Generating Django SECRET_KEY..."
SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
echo "Your generated SECRET_KEY: $SECRET_KEY"
echo "Please add this to your .env file"
echo ""

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p media staticfiles logs

# Database setup
echo "💾 Setting up database..."
read -p "Do you want to run migrations now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 Creating migrations..."
    python manage.py makemigrations
    
    echo "🔧 Running migrations..."
    python manage.py migrate
    
    echo "👤 Creating superuser..."
    python manage.py createsuperuser
    
    echo "📊 Creating default groups..."
    python manage.py shell -c "
from django.contrib.auth.models import Group
Group.objects.get_or_create(name='Admin')
Group.objects.get_or_create(name='Staff')
print('Groups created successfully!')
"
fi

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo ""
echo "================================================"
echo "✅ Setup completed successfully!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Make sure MySQL is running and database is created"
echo "3. Run: python manage.py runserver"
echo "4. Visit: http://localhost:8000/admin/"
echo ""
echo "Happy coding! 🚀" 