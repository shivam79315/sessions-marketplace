from django.contrib.auth.models import AbstractUser
from django.db import models
from core_sessions.constants import Roles


class User(AbstractUser):

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=10,
        choices=Roles.CHOICES,
        default=Roles.USER
    )

    title = models.CharField(
        max_length=255,
        blank=True
    )

    bio = models.TextField(blank=True)

    avatar = models.URLField(blank=True)

    provider = models.CharField(
        max_length=50,
        blank=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def is_creator(self):
        return self.role == Roles.CREATOR

    def __str__(self):
        return self.email