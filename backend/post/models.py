'''
    post models
'''
from django.db import models
from user.models import User
from hashtag.models import Hashtag

class Post(models.Model):
    '''
        post model
    '''
    user = models.ForeignKey(User, \
        related_name='userpost', on_delete=models.CASCADE)
    content = models.CharField(max_length=300, default='')
    image = models.ImageField(upload_to='%Y/%m/%d', blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    reply_to = models.ForeignKey('self', related_name='replypost', \
        on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = 'post'

class PostHashtag(models.Model):
    post = models.ForeignKey(Post, related_name='posthashtag', \
        on_delete=models.CASCADE)
    hashtag = models.ForeignKey(Hashtag, related_name='posthashtag', \
        on_delete=models.CASCADE)
