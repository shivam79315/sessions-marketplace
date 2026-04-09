from django.db import models
from django.conf import settings


class Session(models.Model):

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sessions"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()

    price = models.DecimalField(max_digits=8, decimal_places=2)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title