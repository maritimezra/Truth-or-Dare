from django.db import models
from apps.accounts.models import User
import random

from django.conf import settings


class Level(models.TextChoices):
    MILD = "ML"
    MODERATE = "MD"
    WILD = "WD"


class Category(models.TextChoices):
    GameNight = "G"
    Couples = "C"
    Teens = "T"


class Player(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Lobby(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    player = models.ManyToManyField(Player, related_name="lobbies", blank=True)
    name = models.CharField(max_length=256)
    level = models.CharField(max_length=2, choices=Level, blank=True)
    category = models.CharField(max_length=1, choices=Category, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def add_player(self, player_name):
        player = Player.objects.create(name=player_name, lobby=self)
        return player

    def remove_player(self, player_name):
        player = Player.objects.filter(name=player_name, lobby=self).first()
        if player:
            player.delete()
        else:
            raise Exception("Player not found in the lobby.")

    def lineup(self):
        players = Player.objects.filter(lobby=self)
        player_names = [player.name for player in players]
        random.shuffle(player_names)
        return player_names

    def get_players(self):
        return Player.objects.filter(lobby=self)
