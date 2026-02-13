from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    
    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at", "updated_at"]