'''
    PostSerializer
'''
from rest_framework import serializers
from .models import Post
from hashtag.models import Hashtag
from hashtag.serializer import HashtagSerializer

class PostSerializer(serializers.ModelSerializer):
    '''
        PostSerializer
    '''
    image = serializers.ImageField(use_url=True)
    hashtags = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    reply_to_author = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id',
            'user_name',
            'content',
            'image',
            'latitude',
            'longitude',
            'created_at',
<<<<<<< HEAD
            'reply_to',
=======
            'reply_to_author',
>>>>>>> 8fd93acf02608c82f7f6d13beb80207b05122ba3
            'hashtags',
        )
    def get_hashtags(self, post):
        hashtags = Hashtag.objects.filter(posthashtag__post=post)
        return HashtagSerializer(hashtags, many=True).data
    def get_user_name(self, post):
        return post.user.username
    def get_reply_to_author(self, post):
        if post.reply_to:
            return post.reply_to.user.username
        return None
