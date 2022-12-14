'''
    user views
'''
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from user.models import UserBadge, Badge, Achievement
from .serializer import LogInSerializer, LogOutSerializer, SignUpSerializer, UserSerializer, BadgeSerializer, UserBadgeSerializer,AchievementSerializer
from post.serializer import PostSerializer
#from django.shortcuts import redirect
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView


User = get_user_model()


class UserSignUpView(GenericAPIView):
    '''
        user signup view
    '''
    serializer_class = SignUpSerializer
    authentication_classes = []

    @transaction.atomic
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        data = { 'msg': 'user created' }
        return Response(data, status=status.HTTP_201_CREATED)


class UserLoginView(GenericAPIView):
    '''
        user login view
    '''
    serializer_class = LogInSerializer
    authentication_classes = []

    # POST /user/signin/
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        access_token = serializer.data['tokens']['access']
        refresh_token = serializer.data['tokens']['refresh']
        data = serializer.data
        del data['tokens']
        res = Response(data, status=status.HTTP_200_OK)
        res.set_cookie('access_token', value=access_token, httponly=True)
        res.set_cookie('refresh_token', value=refresh_token, httponly=True)
        return res

class UserLogoutView(GenericAPIView):
    '''
        user logout view
    '''
    serializer_class = LogOutSerializer
    permission_classes = (permissions.IsAuthenticated, )

    # POST /user/signout/
    def post(self, request):
        refresh_token = { 'refresh' : request.COOKIES.get \
            (settings.SIMPLE_JWT['REFRESH_TOKEN'])}
        serializer = self.serializer_class(data = refresh_token)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = { 'msg': 'logout success' }
        res = Response(data, status=status.HTTP_200_OK)
        res.delete_cookie('access_token')
        res.delete_cookie('refresh_token')
        return res


class UserViewSet(viewsets.GenericViewSet):
    '''
        UserViewSet
    '''
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated, )

    # GET /user/
    def list(self, request):
        del request # unnecessary but for pylint
        users = User.objects.all()
        return Response(self.get_serializer(users, many=True).data, \
            status=status.HTTP_200_OK)

    # GET /user/me/
    def retrieve(self, request, pk=None):
        del request
        del pk
        return Response('get me', status=status.HTTP_200_OK)

    # PUT /user/me/
    @transaction.atomic
    def update(self, request, pk=None):
        del request
        del pk
        return Response('put me', status=status.HTTP_200_OK)

    # POST /user/:id/mainbadge/
    @action(detail=True, methods=['POST'])
    @transaction.atomic
    def mainbadge(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = self.get_serializer\
                (user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = serializer.data
        cache.clear()
        return Response(data, status=status.HTTP_200_OK)

    # GET/POST /user/:id/badges/
    # POST: Evaluates Achievement for userbadges, returns updated badges list
    # TODO: optimize db queries
    @action(detail = True, methods=['GET', 'POST'])
    @transaction.atomic
    def badges(self, request, pk=None):
        if request.method == 'GET':
            # For safety. 제대로 db setting 되어 있으면 Badges.objects.all() OK
            badges = Badge.objects.filter(userbadge__user_id = pk)
            data = BadgeSerializer(badges, context = {'pk': pk}, many=True).data
            return Response(data, status=status.HTTP_200_OK)

        if request.method == 'POST':
            userbadges = UserBadge.objects.select_related('badge').filter(
                user_id = pk, is_fulfilled= False)
            # update userbadges' is_fulfilled
            for userbadge in userbadges:
                serializer = UserBadgeSerializer(userbadge,
                data = {}, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
            # return serialized badges
            # For safety. 제대로 db setting 되어 있으면 Badges.objects.all() OK
            badges = Badge.objects.filter(userbadge__user_id = pk)
            data = BadgeSerializer(badges,
            context = {'pk': pk}, partial=True, many=True).data
            return Response(data, status=status.HTTP_201_CREATED)

    # GET/PUT /user/:id/achievement/
    @action(detail=True, methods=['GET', 'PUT'])
    @transaction.atomic
    def achievement(self, request, pk=None):
        if self.request.method == 'GET':
            return Response('get achievement', status=status.HTTP_200_OK)

        if self.request.method == 'PUT':
            badge_id = request.data.get('badge_id')
            achievement = Achievement.objects.get(userbadge__badge_id
            = badge_id, userbadge__user_id = pk)
            serializer = AchievementSerializer(achievement, data = {},
            partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            data = serializer.data
            return Response(data, status=status.HTTP_200_OK)

    # GET/PUT /user/:id/radius/
    @action(detail=True, methods=['GET', 'PUT'])
    @transaction.atomic
    def radius(self, request, pk=None):
        del pk
        user = request.user
        if self.request.method == 'GET':
            return Response('get radius', status=status.HTTP_200_OK)

        if self.request.method == 'PUT':
            serializer = self.get_serializer\
                (user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            data = serializer.data
            return Response(data, status=status.HTTP_200_OK)

    # GET /user/:id/report/
    @action(detail=True)
    @transaction.atomic
    def report(self, request, pk=None):
        del request
        del pk
        return Response('get report', status=status.HTTP_200_OK)

    # GET /user/:id/post/
    @action(detail=True)
    @transaction.atomic
    def post(self, request, pk=None):
        del request
        user = get_object_or_404(User, pk=pk)
        data = cache.get(f'userposts+{user.id}')
        if not data:
            user_posts = user.userpost
            data = PostSerializer(user_posts, many=True).data
            cache.set(f'userposts+{user.id}', data, 60*10)
        return Response(data, status=status.HTTP_200_OK)

