'''
    user serializer
'''
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.authtoken.models import Token
from .models import User, Badge

class LogInSerializer(serializers.ModelSerializer):
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
        fields = ['id', 'username', 'password', 'email', 'radius', 'main_badge', 'tokens']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed('invalid credentials, try again')
        if not user.is_active:
            raise AuthenticationFailed('user not active')

        data = UserSerializer(user).data
        data['tokens'] = user.tokens
        return data

class LogOutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            msg = 'Token is blacklisted'
            raise serializers.ValidationError(msg, code='authorization')

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
    class Meta:
        model = Badge
        fields = '__all__'
