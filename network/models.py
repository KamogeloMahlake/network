from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField("self", related_name="following", blank=True, symmetrical=False)
    
    def to_json(self, user):
        return {
            "id": self.id,
            "username": self.username,
            "followers": self.followers.count(),
            "following": [user.username for user in self.following.all()],
            "isFollowing": user in self.followers.all()
        }


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    like = models.ManyToManyField("User", related_name="likes", blank=True)
    def to_json(self, user):
        return {
            "id": self.id,
            "author": self.author.username,
            "authorId": self.author.id,
            "text": self.text,
            "date": self.date.strftime("%d-%B-%Y %H:%M"),
            "likes": self.like.count(),
            "liked": user.is_authenticated and user in self.like.all(),
            "following": user in self.author.followers.all(),
            "isAuthor": user == self.author
        }

