from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import PermissionDenied
from .models import User, Badge

class UserSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(read_only=True, source='username')
    badges = serializers.SerializerMethodField()
    token = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = (
            "id",
            "user_name",
            "email",
            "password",
            "main_badge",
            "badges",
            "token",
        )
        read_only_fields = ('id', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def get_token(self, user):
        token, created = Token.objects.get_or_create(user=user)
        return token.key

    def get_badges(self, user):
        badges = Badge.objects.filter(userbadge__user=user).values_list('id', flat=True)
        return badges

class BadgeSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = Badge
        fields = '__all__'
