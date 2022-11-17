'''
    user views
'''
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.db import transaction
from django.http import JsonResponse
from .serializer import LogInSerializer, UserSerializer
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
    permission_classes = (permissions.AllowAny, )

    # POST /user/signin/
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        print(serializer)
        serializer.is_valid(raise_exception=True)
        return JsonResponse(data=serializer.data, status=status.HTTP_200_OK)


class UserLogoutView(GenericAPIView):
    '''
        user logout view
    '''
    permission_classes = (permissions.IsAuthenticated, )

    # POST /user/signout/
    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=status.HTTP_200_OK)


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
