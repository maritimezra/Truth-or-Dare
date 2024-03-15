from django.db import models


class Lobby(models.Model):

    pass


class Player(Lobby):
    name = models.CharField(max_length=20)
    lobby = models.ForeignKey("Lobby", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name
