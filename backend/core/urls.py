from django.contrib import admin
from django.urls import path
from strawberry.django.views import GraphQLView  # type: ignore
from strawberry_jwt_auth.views import strawberry_auth_view  # type: ignore

from api.schema import schema

urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql/", strawberry_auth_view(GraphQLView.as_view(schema=schema))),
]
