from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({'status': 'healthy', 'message': 'Phone Store API is running'})


@api_view(['GET'])
def system_info(request):
    """System information endpoint"""
    from django.conf import settings
    return Response({
        'app_name': 'Phone Store Management System',
        'version': '1.0.0',
        'imei_tracking_enabled': settings.ENABLE_IMEI_TRACKING,
    })


urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('info/', system_info, name='system-info'),
] 