from django.shortcuts import render
from .serializers import TaskSerializer
from .models import Task
from rest_framework import viewsets, permissions

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