from django.urls import path
from .views import hello, createuser, login
from rest_framework_simplejwt.views import TokenRefreshView


# relevant patterns
urlpatterns = [
    path('greetings/', hello, name="greetings"),
    path('create/', createuser, name='create user'),
    path('login/', login, name='Login user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
