import strawberry, jwt
from typing import List, Optional
from strawberry_django.optimizer import DjangoOptimizerExtension
from strawberry.types import Info

from apps.accounts.types import UserType
from .types import LobbyType, PlayerType
from .models import *

from django.conf import settings


@strawberry.type
class Query:
    @strawberry.field
    def get_creator(self, info: Info, lobby_id: int) -> UserType:
        lobby = Lobby.objects.get(id=lobby_id)
        creator = lobby.creator
        return UserType(
            id=creator.id,
            username=creator.username,
            email=creator.email,
            avatar=creator.avatar,
            gender=creator.gender,
            is_staff=creator.is_staff,
            is_active=creator.is_active,
            date_joined=creator.date_joined,
        )

    @strawberry.field
    def get_lobbies(self, info) -> List[LobbyType]:
        request = info.context["request"]
        user = request.user
        user_lobbies = Lobby.objects.filter(creator=user)

        lobbies = [
            Lobby(
                id=lobby.id,
                name=lobby.name,
                level=lobby.level,
                category=lobby.category,
                creator=lobby.creator,
                created_at=lobby.created_at,
            )
            for lobby in user_lobbies
        ]

        return lobbies

    @strawberry.field
    def get_lobby(self, lobby_id: int) -> LobbyType:
        return Lobby.objects.get(id=lobby_id)

    @strawberry.field
    def get_players(self, lobby_id: int) -> List[PlayerType]:
        lobby = Lobby.objects.get(id=lobby_id)
        return list(lobby.player.all())

    @strawberry.field
    def lineup(self, lobby_id: int) -> List[str]:
        lobby = Lobby.objects.get(id=lobby_id)
        players = Player.objects.filter(lobby=lobby)
        player_names = [player.name for player in players]
        random.shuffle(player_names)
        return player_names

    @strawberry.field
    def me(self, info) -> UserType:
        auth_header = info.context.request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise Exception("Invalid Authorization header format.")

        try:
            # Decode the JWT token to get the user information
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]
            user = User.objects.get(id=user_id)

            user_instance = UserType(
                id=user.id,
                username=user.username,
                email=user.email,
                avatar=user.avatar,
                gender=user.gender,
                is_staff=user.is_staff,
                is_active=user.is_active,
                date_joined=str(user.date_joined),
            )

            return user_instance
        except (jwt.DecodeError, User.DoesNotExist):
            raise Exception("User is not logged in")


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_lobby(
        self,
        info,
        name: str,
        level: str,
        category: str,
    ) -> LobbyType:
        auth_header = info.context.request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise Exception("Invalid Authorization header format.")

        try:
            # Decode the JWT token to get the user information
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]
            user = User.objects.get(id=user_id)
        except (jwt.DecodeError, User.DoesNotExist):
            raise Exception("Authentication required to create a lobby.")

        # Create the new lobby
        lobby = Lobby.objects.create(
            name=name,
            creator=user,
            level=level,
            category=category,
        )
        return lobby

    @strawberry.mutation
    def delete_lobby(self, lobby_id: int) -> str:
        try:
            lobby = Lobby.objects.get(id=lobby_id)
            lobby.delete()
            return f"Lobby with ID {lobby_id} deleted successfully."
        except Lobby.DoesNotExist:
            return f"Lobby with ID {lobby_id} does not exist."

    @strawberry.mutation
    def add_player(self, lobby_id: int, player_name: str) -> PlayerType:
        lobby = Lobby.objects.get(id=lobby_id)
        player = Player.objects.create(name=player_name)
        lobby.player.add(player)
        return player

    @strawberry.mutation
    def remove_player(self, lobby_id: int, player_id: int) -> str:
        lobby = Lobby.objects.get(id=lobby_id)
        player = lobby.player.get(id=player_id)
        lobby.player.remove(player)
        player.delete()
        return player


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
    ],
)
