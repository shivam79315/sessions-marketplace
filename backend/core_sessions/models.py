from django.conf import settings
from django.db import models


class Session(models.Model):

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sessions"
    )

    category = models.ForeignKey(
        "Category",
        on_delete=models.SET_NULL,
        null=True,
        related_name="sessions"
    )

    title = models.CharField(max_length=255)

    short_description = models.CharField(max_length=300)

    description = models.TextField()

    image = models.URLField()

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    duration_minutes = models.PositiveIntegerField()

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0
    )

    review_count = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Category(models.Model):

    name = models.CharField(
        max_length=100,
        unique=True
    )

    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name