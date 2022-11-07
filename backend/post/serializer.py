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

    class Meta:
        model = Post
        fields = (
            'id',
            'user',
            'content',
            'image',
            'latitude',
            'longitude',
            'created_at',
            'reply_to',
            'hashtags',
        )
    def get_hashtags(self, post):
        hashtags = Hashtag.objects.filter(posthashtag__post=post)
        return HashtagSerializer(hashtags, many=True).data
