from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Task
from .utils.emails import send_email


@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3, "countdown": 60})
def send_due_date_reminders(self):
    now = timezone.now()
    soon = now + timedelta(hours=24)

    tasks = Task.objects.filter(
        due_date__isnull=False,
        due_date__gte=now,
        due_date__lte=soon,
        is_completed=False,
        due_reminder_sent=False,
    )

    for task in tasks:
        send_email(
            subject=" Task Due Soon",
            message=(
                f"Hey {task.user.username},\n\n"
                f"Your task '{task.title}' is due at {task.due_date}.\n"
                f"Handle it."
            ),
            to=[task.user.email],
        )

        task.due_reminder_sent = True
        task.save(update_fields=["due_reminder_sent"])

    return f"{tasks.count()} reminder(s) sent"
