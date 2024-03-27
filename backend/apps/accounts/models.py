from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class Gender(models.TextChoices):
    MALE = "M"
    FEMALE = "F"
    NONBINARY = "N"


class User(AbstractBaseUser, PermissionsMixin):
    avatar = models.ImageField(upload_to="avatars/", blank=True)
    email = models.EmailField(_("email address"), unique=True)
    gender = models.CharField(max_length=1, choices=Gender, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def get_short_name(self):
        return self.email.split("@")[0]
