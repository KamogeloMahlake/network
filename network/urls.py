
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("compose", views.compose, name="compose"),
    path("posts/<str:view>/<int:id>/<int:page_nr>", views.posts, name="posts"),
    path("like/<int:id>", views.like, name="like"),
    path("follow/<int:id>", views.follow, name="follow")
]
