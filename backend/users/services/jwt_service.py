from rest_framework_simplejwt.tokens import RefreshToken


class JWTService:

    @staticmethod
    def generate_tokens(user):
        """
        Generate access + refresh tokens for user
        """
        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }