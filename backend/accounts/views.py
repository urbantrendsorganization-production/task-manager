from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializers, UserSerializer
from django.contrib.auth import authenticate
from .utils.emails import send_email
from django.contrib.auth.models import User
import requests
import os


# Create your views here.
def hello(request):
    return HttpResponse("Welcome to accounts application")


# register user
@api_view(['POST'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(
        request,
        username=username,
        password=password
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


def _issue_tokens_for_user(user):
    """Return JWT access+refresh tokens and serialised user data for the given user."""
    refresh = RefreshToken.for_user(user)
    return {
        "user": UserSerializer(user).data,
        "accessToken": str(refresh.access_token),
        "refreshToken": str(refresh),
    }


# ─── Google OAuth ────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Exchange a Google OAuth2 access token (from the frontend) for a TaskFlow JWT.

    The frontend completes the Google OAuth consent and POSTs the resulting
    access token here.  We verify it by fetching the Google userinfo endpoint,
    then get-or-create the local User account, and return our own JWT pair.

    Body: { "access_token": "<google access token>" }
    """
    access_token = request.data.get("access_token")
    if not access_token:
        return Response({"error": "access_token is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Verify the token with Google and fetch profile information
    try:
        google_resp = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        google_resp.raise_for_status()
    except requests.RequestException:
        return Response({"error": "Failed to verify Google token"}, status=status.HTTP_400_BAD_REQUEST)

    profile = google_resp.json()
    email = profile.get("email")
    google_sub = profile.get("sub")  # stable Google user ID

    if not email or not google_sub:
        return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)

    # Derive a deterministic username from the Google sub so collisions can't
    # occur with normally-registered users.
    username = f"g_{google_sub}"

    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            "email": email,
            "first_name": profile.get("given_name", ""),
            "last_name": profile.get("family_name", ""),
        },
    )

    # Keep email in sync in case the user changes it on Google
    if not created and user.email != email:
        user.email = email
        user.save(update_fields=["email"])

    if created:
        send_email(
            subject="Welcome to Urbantrends Task-flow",
            message=f"Hello {user.first_name or user.username}, welcome to Task Manager!",
            to=[email],
        )

    return Response(_issue_tokens_for_user(user), status=status.HTTP_200_OK)


# ─── GitHub OAuth ────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def github_auth(request):
    """
    Exchange a GitHub OAuth2 code for a TaskFlow JWT.

    The frontend redirects to GitHub and, upon return, POSTs the one-time
    ``code`` here.  We exchange it for a GitHub access token, fetch the
    user's profile and primary email, then get-or-create the local User.

    Body: { "code": "<github oauth code>" }
    """
    code = request.data.get("code")
    if not code:
        return Response({"error": "code is required"}, status=status.HTTP_400_BAD_REQUEST)

    client_id = os.getenv("GITHUB_CLIENT_ID")
    client_secret = os.getenv("GITHUB_CLIENT_SECRET")

    if not client_id or not client_secret:
        return Response({"error": "GitHub OAuth is not configured"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    # Exchange code for access token
    try:
        token_resp = requests.post(
            "https://github.com/login/oauth/access_token",
            json={"client_id": client_id, "client_secret": client_secret, "code": code},
            headers={"Accept": "application/json"},
            timeout=10,
        )
        token_resp.raise_for_status()
    except requests.RequestException:
        return Response({"error": "Failed to contact GitHub"}, status=status.HTTP_400_BAD_REQUEST)

    token_data = token_resp.json()
    gh_access_token = token_data.get("access_token")
    if not gh_access_token:
        return Response({"error": "GitHub did not return an access token"}, status=status.HTTP_400_BAD_REQUEST)

    gh_headers = {"Authorization": f"Bearer {gh_access_token}", "Accept": "application/json"}

    # Fetch GitHub user profile
    try:
        profile_resp = requests.get("https://api.github.com/user", headers=gh_headers, timeout=10)
        profile_resp.raise_for_status()
        profile = profile_resp.json()
    except requests.RequestException:
        return Response({"error": "Failed to fetch GitHub profile"}, status=status.HTTP_400_BAD_REQUEST)

    github_id = profile.get("id")
    if not github_id:
        return Response({"error": "Invalid GitHub token"}, status=status.HTTP_400_BAD_REQUEST)

    # GitHub users can have no public email — fetch primary email separately
    email = profile.get("email")
    if not email:
        try:
            emails_resp = requests.get("https://api.github.com/user/emails", headers=gh_headers, timeout=10)
            emails_resp.raise_for_status()
            primary = next((e for e in emails_resp.json() if e.get("primary") and e.get("verified")), None)
            email = primary["email"] if primary else None
        except requests.RequestException:
            email = None

    username = f"gh_{github_id}"

    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            "email": email or "",
            "first_name": (profile.get("name") or "").split(" ")[0],
            "last_name": " ".join((profile.get("name") or "").split(" ")[1:]),
        },
    )

    if not created and email and user.email != email:
        user.email = email
        user.save(update_fields=["email"])

    if created and email:
        send_email(
            subject="Welcome to Urbantrends Task-flow",
            message=f"Hello {user.first_name or user.username}, welcome to Task Manager!",
            to=[email],
        )

    return Response(_issue_tokens_for_user(user), status=status.HTTP_200_OK)
