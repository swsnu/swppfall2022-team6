from rest_framework import serializers 
from django.db import models
from .models import *
from hashtag.serializer import HashtagSerializer

class PostSerializer(serializers.ModelSerializer):
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
            'reply_to',
            'hashtags',
        )
    
    def get_hashtags(self, post):
        hashtags = Hashtag.objects.filter(posthashtag__post=post)
        return HashtagSerializer(hashtags, many=True).data