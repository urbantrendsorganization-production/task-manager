from django.urls import path
from .views import hello, createuser, login, get_users
from rest_framework_simplejwt.views import TokenRefreshView


# relevant patterns
urlpatterns = [
    path('greetings/', hello, name="greetings"),
    path('create/', createuser, name='create user'),
    path('login/', login, name='Login user'),
    path('get-users/', get_users, name='get all users'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
