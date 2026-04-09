from rest_framework.permissions import BasePermission
from core_sessions.constants import Roles


class IsCreator(BasePermission):
    """
    Allow only creators
    """

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == Roles.CREATOR
        )
    
class IsUser(BasePermission):
    """
    Allow only normal users
    """

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == Roles.USER
        )

class IsAuthenticatedUser(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
