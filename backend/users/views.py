from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import GoogleLoginSerializer
from .services.google_auth_service import GoogleAuthService
from .services.jwt_service import JWTService


class GoogleLoginView(APIView):

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        credential = serializer.validated_data["credential"]

        try:
            # 1. Validate token
            data = GoogleAuthService.validate_token(credential)

            # 2. Get/Create user
            user = GoogleAuthService.get_or_create_user(data)

            # 3. Generate JWT
            tokens = JWTService.generate_tokens(user)

            return Response(tokens, status=status.HTTP_200_OK)

        except Exception:
            return Response(
                {"error": "Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )