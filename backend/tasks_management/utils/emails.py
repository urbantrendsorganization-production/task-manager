from django.core.mail import EmailMessage
from django.conf import settings

def send_email(subject, message, to):
    try:
        email = EmailMessage(
           subject=subject,
           body=message,
           from_email=settings.DEFAULT_FROM_EMAIL,
           to=to or []
        )
        email.content_subtype = "html"
        email.send(fail_silently=False)
        return "sent"
    except Exception as e:
        print("Email sending error", str(e))
        return str(e)