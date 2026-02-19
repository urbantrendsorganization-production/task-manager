from rest_framework.routers import DefaultRouter
from .views import TasksViewSet, DueDateRemindersView

router = DefaultRouter()
router.register(r"tasks", TasksViewSet, basename="tasks")
router.register(r"due-date-reminders", DueDateRemindersView, basename="due-date-reminders")

urlpatterns = router.urls
