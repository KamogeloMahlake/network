from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    like = models.ManyToManyField("Post", related_name="likes", blank=True)
    def serialize(self):
        return {
            "id": self.id,
            "author": self.author.username,
            "text": self.text,
            "date": self.date.strftime("%d-%B-%Y %H:%M"),
            "likes": self.likes.count(),
            
        }

