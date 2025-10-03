from django.urls import path
from .views import (
    sales_report, inventory_report, top_products,
    dashboard_stats, stock_movements_report, daily_revenue_chart
)

urlpatterns = [
    path('sales/', sales_report, name='sales-report'),
    path('inventory/', inventory_report, name='inventory-report'),
    path('top-products/', top_products, name='top-products'),
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
    path('stock-movements/', stock_movements_report, name='stock-movements-report'),
    path('daily-revenue/', daily_revenue_chart, name='daily-revenue-chart'),
] 