from datetime import timedelta, timezone
from django.shortcuts import render
from celery import shared_task
from .serializers import TaskSerializer
from .models import Task
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .utils.emails import send_email
from .tasks import send_due_date_reminders

# Create your views here.

class TasksViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # only return tasks related to the specified use
        return Task.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # assign task to logged in user
        serializer.save(user=self.request.user)
        # send email notification
        email_sent = send_email(
            subject="New Task Created",
            message=f"Hello {self.request.user.username}, a new task {serializer.instance.title} has been created for you.",
            to=[self.request.user.email]
        )
        return Response({"email_sent": email_sent})

# due date email sending
class DueDateRemindersView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        result = send_due_date_reminders.delay()
        return Response({"task_id": result.id})