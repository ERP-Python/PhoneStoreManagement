"""
URL configuration for phone store management system.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('apps.users.urls')),
    path('api/brands/', include('apps.catalog.urls.brands')),
    path('api/products/', include('apps.catalog.urls.products')),
    path('api/suppliers/', include('apps.procurement.urls.suppliers')),
    path('api/purchase-orders/', include('apps.procurement.urls.purchase_orders')),
    path('api/stock-in/', include('apps.procurement.urls.stock_in')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/customers/', include('apps.customers.urls')),
    path('api/orders/', include('apps.sales.urls.orders')),
    path('api/payments/', include('apps.sales.urls.payments')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/', include('apps.core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.ASSETS_URL, document_root=settings.ASSETS_ROOT)

# Customize admin site
admin.site.site_header = "Phone Store Management"
admin.site.site_title = "Phone Store Admin"
admin.site.index_title = "Welcome to Phone Store Management System" 