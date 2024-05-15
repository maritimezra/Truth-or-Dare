import jwt
import strawberry
from typing import List, Optional
from strawberry_django.optimizer import DjangoOptimizerExtension
from django.contrib.auth import authenticate
from django.conf import settings


from strawberry_jwt_auth.extension import JWTExtension

from strawberry_jwt_auth.decorator import login_required

from .models import User
from .types import LoginResponse, UserType

from django.conf import settings
from strawberry.types import Info


@strawberry.type
class Query:

    @strawberry.field
    def get_users(self, info) -> List[UserType]:
        return User.objects.all()

    @strawberry.field
    @login_required
    def me(self, info) -> UserType:
        return info.context.request.user


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_user(
        email: str,
        password: str,
        username: str,
        gender: str,
    ) -> UserType:
        user = User.objects.create_user(
            email=email,
            password=password,
            username=username,
            gender=gender,
        )
        return user

    @strawberry.mutation
    def login(self, info, email: str, password: str) -> LoginResponse:
        # Authenticate user
        user = authenticate(email=email, password=password)

        if user is not None and user.is_authenticated:
            print(f"Authenticated user: {user.email}")
            setattr(info.context.request, "user", user)

            # Generate a JWT token with user information
            token_payload = {
                "user_id": user.id,
                "email": user.email,
            }
            token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm="HS256")

            return LoginResponse(success=True, token=token)
        else:
            # Return error response if authentication fails
            print("Authentication failed")
            return LoginResponse(success=False, token=None)

    @strawberry.mutation
    def logout(self, info) -> bool:
        user = info.context.request.user

        if user:
            setattr(info.context.request, "revokeTokens", True)
            return True
        else:
            return False

    @strawberry.mutation
    @login_required
    def change_password(self, info, old_password: str, new_password: str) -> bool:
        user = info.context.request.user
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return True
        else:
            return False


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
        JWTExtension,
    ],
)
