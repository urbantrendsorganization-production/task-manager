from django.urls import path
from .views import hello, createuser, login, get_users, google_auth, github_auth
from rest_framework_simplejwt.views import TokenRefreshView


# relevant patterns
urlpatterns = [
    path('greetings/', hello, name="greetings"),
    path('create/', createuser, name='create user'),
    path('login/', login, name='Login user'),
    path('get-users/', get_users, name='get all users'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Social authentication
    path('social/google/', google_auth, name='google_auth'),
    path('social/github/', github_auth, name='github_auth'),
]
