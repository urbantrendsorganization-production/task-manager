from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken 
from .serializers import UserSerializers, UserSerializer
from django.contrib.auth import authenticate
from .utils.emails import send_email
from django.contrib.auth.models import User

# Create your views here.
def hello(request):
    return HttpResponse("Welcome to accounts application")

# register user
@api_view(['POST'])
def createuser(request):
    if request.method == 'POST':
        serializer = UserSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            email_sent = send_email(
                subject="Welcome to Urbantrends Task-flow",
                message=f"Hello {serializer.data['username']}, welcome to Task Manager!",
                to=[serializer.data['email']]
            )
            return Response({"User created": serializer.data, "email_sent": email_sent}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# login user
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(
        request,
        username = username,
        password = password
    )

    if user is None:
        return Response({"error": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)

    user_data = UserSerializer(user).data

    return Response({
        "user": user_data,
        "accessToken": str(refresh.access_token),
        "refreshToken": str(refresh)
    }, status=status.HTTP_200_OK)

# get all users
@api_view(['GET'])
def get_users(request):
    
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)