import strawberry_django
from strawberry import auto
import strawberry

from . import models
from apps.accounts.types import UserType


@strawberry_django.type(models.Player)
class PlayerType:
    id: auto
    name: str


@strawberry_django.type(models.Lobby)
class LobbyType:
    id: auto
    creator: UserType
    name: str
    level: str
    category: str
    created_at: str
    player = PlayerType

@strawberry.input
class InputUserType:
    id: str
    username: str
    email: str
    avatar: str = None