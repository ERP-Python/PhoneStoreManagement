from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, GroupViewSet,
    login_view, logout_view, current_user_view, csrf_token_view
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'groups', GroupViewSet, basename='group')

urlpatterns = [
    # Authentication endpoints
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('me/', current_user_view, name='current-user'),
    path('csrf/', csrf_token_view, name='csrf-token'),
    
    # User & Group management
    path('', include(router.urls)),
] 