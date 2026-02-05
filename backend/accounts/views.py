from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .serializers import UserSerializers, UserSerializer
from django.contrib.auth import authenticate

# Create your views here.
def hello(request):
    return HttpResponse("Welcome to accounts application")

@api_view(['POST'])
def createuser(request):
    if request.method == 'POST':
        serializer = UserSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"User created", serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST']):
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(
        request,
        username = usename,
        email = email,
        password = password
    )

    if user is None:
        return Response({"error": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

