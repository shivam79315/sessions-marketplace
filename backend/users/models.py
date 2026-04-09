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

    avatar = models.URLField(blank=True, null=True)

    # OAuth provider
    provider = models.CharField(max_length=50, blank=True, null=True)

    # email based authentication
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def is_creator(self):
        return self.role == Roles.CREATOR