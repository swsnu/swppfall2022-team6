'''
    user views
'''
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db import transaction
from .serializer import LogInSerializer, LogOutSerializer, UserSerializer
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
    authentication_classes = []
    # POST /user/signup/
    def post(self, request):
        body = request.data

        email = body.get('email')
        password = body.get('password')
        username = body.get('username')
        User.objects.create_user \
            (email=email, password=password, username=username)
        return Response('signup', status=status.HTTP_201_CREATED)


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
        print(serializer.validated_data)
        access_token = serializer.data["tokens"]["access"]
        refresh_token = serializer.data["tokens"]["refresh"]
        data = serializer.data
        del data["tokens"]
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
        refresh_token = { "refresh" : request.COOKIES.get(settings.SIMPLE_JWT['REFRESH_TOKEN'])}
        serializer = self.serializer_class(data = refresh_token)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = { "msg": "logout success" }
        res = Response(data, status=status.HTTP_200_OK)
        res.delete_cookie('access_token')
        res.delete_cookie('refresh_token')
        return res


class UserViewSet(viewsets.GenericViewSet):
    '''
        UserViewSet
    '''

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

    # GET/POST /user/:id/badges/
    @action(detail=True, methods=['GET', 'POST'])
    @transaction.atomic
    def badges(self, request, pk=None):
        del request
        del pk
        if self.request.method == 'GET':
            return Response('get badges', status=status.HTTP_200_OK)

        if self.request.method == 'POST':
            return Response('post badges', status=status.HTTP_201_CREATED)

    # GET/PUT /user/:id/radius/
    @action(detail=True, methods=['GET', 'PUT'])
    @transaction.atomic
    def radius(self, request, pk=None):
        del request
        del pk
        if self.request.method == 'GET':
            return Response('get radius', status=status.HTTP_200_OK)

        if self.request.method == 'PUT':
            return Response('put radius', status=status.HTTP_200_OK)

    # GET/PUT /user/:id/achievement/
    @action(detail=True, methods=['GET', 'PUT'])
    @transaction.atomic
    def achievement(self, request, pk=None):
        del request
        del pk
        if self.request.method == 'GET':
            return Response('get achievement', status=status.HTTP_200_OK)

        if self.request.method == 'PUT':
            return Response('put achievement', status=status.HTTP_200_OK)

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
        del pk
        return Response('get post', status=status.HTTP_200_OK)
