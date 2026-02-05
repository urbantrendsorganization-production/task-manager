from django.urls import path
from .views import hello, createuser

# relevant patterns
urlpatterns = [
    path('greetings/', hello, name="greetings"),
    path('create/', createuser, name='create user')
]