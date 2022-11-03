from rest_framework import serializers 
from django.db import models
from .models import *

class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = '__all__'