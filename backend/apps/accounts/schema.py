import strawberry
from typing import List
from strawberry_django.optimizer import DjangoOptimizerExtension

from strawberry_jwt_auth.extension import JWTExtension

from strawberry_jwt_auth.decorator import login_required

from .models import User
from .types import UserType


@strawberry.input
class EmailInput:
    email: str


@strawberry.input
class PasswordInput:
    password: str


@strawberry.type
class Query:

    @strawberry.field
    def get_email(self, email_input: EmailInput) -> str:
        return email_input.email

    @strawberry.field
    def get_password(self, password_input: PasswordInput) -> str:
        return password_input.password

    @strawberry.field
    @login_required
    def me(self, info) -> UserType:
        return info.context.request.user


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_user(
        self,
        email: str,
        password: str,
    ) -> UserType:
        user = User.objects.create(
            email=email,
            password=password,
        )
        return user

    @strawberry.mutation
    def login(
        self, info, email_input: EmailInput, password_input: PasswordInput
    ) -> bool:
        email = email_input.email
        password = password_input.password

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return False

        if user.check_password(password):
            setattr(info.context, "userID", user.id)
            setattr(info.context.request, "issueNewTokens", True)
            setattr(info.context.request, "clientID", user.id)
            return True
        else:
            return False

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
