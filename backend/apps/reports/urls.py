from django.urls import path
from .views import (
    sales_report, inventory_report, top_products,
    dashboard_stats, stock_movements_report, daily_revenue_chart, monthly_revenue_chart,
    daily_stats, monthly_stats, yearly_stats
)

urlpatterns = [
    path('sales/', sales_report, name='sales-report'),
    path('inventory/', inventory_report, name='inventory-report'),
    path('top-products/', top_products, name='top-products'),
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
    path('stock-movements/', stock_movements_report, name='stock-movements-report'),
    path('daily-revenue/', daily_revenue_chart, name='daily-revenue-chart'),
    path('monthly-revenue/', monthly_revenue_chart, name='monthly-revenue-chart'),
    path('daily-stats/', daily_stats, name='daily-stats'),
    path('monthly-stats/', monthly_stats, name='monthly-stats'),
    path('yearly-stats/', yearly_stats, name='yearly-stats'),
] 