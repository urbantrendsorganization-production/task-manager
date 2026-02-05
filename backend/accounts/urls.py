from django.urls import path
from .views import hello, createuser, login

# relevant patterns
urlpatterns = [
    path('greetings/', hello, name="greetings"),
    path('create/', createuser, name='create user'),
    path('login/', login, name='Login user'),
]