import strawberry
from typing import List
from strawberry_django.optimizer import DjangoOptimizerExtension

from apps.accounts.types import UserType
from .types import LobbyType, PlayerType, InputUserType
from .models import *

# from graphql import GraphQLError
# from django.utils.translation import gettext_lazy as _


@strawberry.type
class Query:
    @strawberry.field
    def get_creator(self, info, lobby_id: int) -> UserType:
        lobby = Lobby.objects.get(id=lobby_id)
        request = info.context["request"]
        if request.user == lobby.creator:
            return request.user
        else:
            pass
        return lobby.creator
        # return lobby.creator.username

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
        request = info.context["request"]
        if request.user.is_authenticated:
            return UserType(
                id=request.user.id,
                username=request.user.username,
                email=request.user.email,
                avatar=request.user.avatar,
                gender=request.user.gender,
                is_staff=request.user.is_staff,
                is_active=request.user.is_active,
                date_joined=str(request.user.date_joined),
            )
        else:
            return UserType(
                id=None,
                username=None,
                email=None,
                avatar=None,
                gender=None,
                is_staff=False,
                is_active=False,
                date_joined=None,
            )


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
        request = info.context["request"]
        # user = request.user
        user = UserType(
            id=request.user.id,
            username=request.user.username,
            # avatar=request.user.avatar,
            email=request.user.email,
            gender=request.user.gender,
            is_staff=request.user.is_staff,
            is_active=request.user.is_active,
            date_joined=str(request.user.date_joined),
        )

        lobby = Lobby.objects.create(
            name=name,
            creator=user,
            level=level,
            category=category,
        )
        return lobby

    # @strawberry.mutation
    # def create_lobby(self, info, name: str, level: str, category: str) -> LobbyType:
    #     user = info.context.request.user

    #     # Check if user is authenticated
    #     if not user.is_authenticated:
    #         raise GraphQLError(_("User is not authenticated."))

    #     # Proceed with creating the lobby
    #     lobby = Lobby.objects.create(
    #         name=name,
    #         creator=user,
    #         level=level,
    #         category=category,
    #     )
    #     return lobby


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
    def remove_player(self, lobby_id: int, player_name: str) -> str:
        lobby = Lobby.objects.get(id=lobby_id)
        player = Player.objects.filter(lobby=lobby, name=player_name).first()

        if player:
            player.delete()
            return f"Player {player_name} removed successfully from the lobby."
        else:
            return f"Player {player_name} not found in the lobby."


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[
        DjangoOptimizerExtension,
    ],
)
