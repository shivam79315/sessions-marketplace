from rest_framework.permissions import IsAuthenticated
from users.permissions import IsCreator

permission_classes = [IsAuthenticated, IsCreator]