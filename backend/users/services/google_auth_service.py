from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


class GoogleAuthService:

    @staticmethod
    def validate_token(credential: str) -> dict:
        """
        Verify Google token and return user data
        """
        return id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

    @staticmethod
    def get_or_create_user(data: dict):
        """
        Create or fetch user from DB
        """
        email = data.get("email")
        name = data.get("name", "")
        picture = data.get("picture")

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": name,
                "avatar": picture,
                "provider": "google",
            }
        )

        return user