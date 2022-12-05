'''
    PostSerializer
'''
from rest_framework import serializers
from .models import Post
from hashtag.models import Hashtag
from user.models import Badge
from hashtag.serializer import HashtagSerializer

class PostSerializer(serializers.ModelSerializer):
    '''
        PostSerializer
    '''
    image = serializers.ImageField(use_url=True)
    hashtags = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    badge_id = serializers.SerializerMethodField()
    reply_to_author = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id',
            'user_name',
            'badge_id',
            'content',
            'image',
            'latitude',
            'longitude',
            'created_at',
            'reply_to_author',
            'hashtags',
        )
    def get_hashtags(self, post):
        hashtags = Hashtag.objects.filter(posthashtag__post=post)
        return HashtagSerializer(hashtags, many=True).data
    def get_user_name(self, post):
        return post.user.username
    def get_badge_id(self, post):
        badge_id = Badge.objects.get(id = post.user.main_badge.id).id
        return badge_id
    def get_reply_to_author(self, post):
        if post.reply_to:
            return post.reply_to.user.username
        return None
