'''
    user serializer
'''
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import User, Badge, UserBadge, Achievement, BADGE_NUM

class SignUpSerializer(serializers.ModelSerializer):
    '''
        signup serializer
    '''
    password = serializers.CharField(max_length=68, min_length=8, \
        write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate(self, attrs):
        # TODO: add validation logic
        username = attrs.get('username', '')
				# isalnum(): is alphabet number
        if not username.isalnum():
            raise serializers.ValidationError(self.default_error_messages)
        return attrs

    def create_badges(self, user_id):
        for badge_id in range (1, BADGE_NUM+1):
            userbadge = UserBadge.objects.create(user_id = user_id, badge_id = badge_id)
            Achievement.objects.create(userbadge=userbadge)


    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        self.create_badges(user.id)
        return user

class LogInSerializer(serializers.ModelSerializer):
    '''
        login serializer
    '''
    username = serializers.CharField(read_only=True)
    password = serializers.CharField(max_length=68, write_only=True)
    email = serializers.EmailField()
    main_badge = serializers.IntegerField(read_only=True)
    tokens = serializers.SerializerMethodField()

    def get_tokens(self, obj):
        user =  User.objects.get(username=obj['username'])
        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'radius', \
            'main_badge', 'tokens']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed('invalid credentials, try again')

        data = UserSerializer(user).data
        data['tokens'] = user.tokens
        return data

class LogOutSerializer(serializers.Serializer):
    '''
        logout serializer
    '''
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError as exc:
            msg = 'Token is blacklisted'
            raise serializers.ValidationError\
                (msg, code='authorization') from exc

class UserSerializer(serializers.ModelSerializer):
    '''
        user serializer
    '''
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'username',
            'password',
            'radius',
            'main_badge',
        )
        read_only_fields = ('id', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    # def get_token(self, user):
    #     token = Token.objects.get_or_create(user=user)
    #     return token[0].key

    # def get_badges(self, user):
    #     badges = Badge.objects.filter(userbadge__user=user) \
    #                             .values_list('id', flat=True)
    #     return badges

class BadgeSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    is_fulfilled = serializers.SerializerMethodField()
    class Meta:
        model = Badge
        fields = (
            'id',
            'title',
            'image',
            'description',
            'is_fulfilled',
        )
    def get_is_fulfilled(self, badge):
        user_id = self.context.get('pk')
        is_fulfilled = UserBadge.objects.get(user_id=user_id, badge=badge).is_fulfilled
        return is_fulfilled

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'

    def update(self, instance, validated_data):
        del validated_data
        instance.status += 1
        instance.save()
        return instance

class UserBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBadge
        fields = '__all__'

    def update(self, instance, validated_data):
        del validated_data
        achievement_status = instance.achievement.status
        if (achievement_status >= instance.badge.requirement):
            instance.is_fulfilled = True
            instance.save()
        return instance




