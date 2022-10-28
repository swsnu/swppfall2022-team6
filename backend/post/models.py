from django.db import models
from user.models import User
from hashtag.models import Hashtag

class Post(models.Model):
    user = models.ForeignKey(User, related_name='userpost', on_delete=models.CASCADE)
    content = models.CharField(max_length=300, default="")
    image = models.ImageField(upload_to='post', null=True)
    latitude = models.FloatField()
    longitutde = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    reply_to = models.ForeignKey('self', related_name='post', on_delete=models.CASCADE)

    class Meta:
        db_table = 'post'


class PostHashtag(models.Model):
    post = models.ForeignKey(Post, related_name='posthashtag', on_delete=models.CASCADE)
    hashtag = models.ForeignKey(Hashtag, related_name='posthashtag', on_delete=models.CASCADE)