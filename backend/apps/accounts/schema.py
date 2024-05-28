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

    @strawberry.field
    def get_username(self, info) -> UserType:
        user = info.context.request.user
        if user.is_authenticated:
            # Get the JWT token from the request headers
            auth_header = info.context.request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                try:
                    # Decode the JWT token
                    decoded_token = jwt.decode(
                        token, settings.SECRET_KEY, algorithms=["HS256"]
                    )
                    user_id = decoded_token.get("user_id")
                    email = decoded_token.get("email")
                    if user_id and email:
                        # Assuming user information is stored in the database
                        user = User.objects.get(id=user_id, email=email)
                        return UserType(
                            id=user.id,
                            username=user.username,
                            avatar=user.avatar,
                            email=user.email,
                            is_staff=user.is_staff,
                            is_active=user.is_active,
                            gender=user.gender,
                            date_joined=user.date_joined,
                        )
                except jwt.ExpiredSignatureError:
                    # Handle token expiration error
                    print("JWT token has expired")
                except jwt.InvalidTokenError:
                    # Handle invalid token error
                    print("Invalid JWT token")
            else:
                print("Authorization header is missing or invalid")
        return (
            None  # Return None if user is not authenticated or if token decoding fails
        )


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
