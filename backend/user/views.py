'''
    user views
'''
from django.contrib.auth import get_user_model #, login, logout
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView


User = get_user_model()


class UserSignUpView(GenericAPIView):

    # POST /user/signup/
    def post(self): # def post(self, request):
        return Response("signup", status=status.HTTP_201_CREATED)


class UserLoginView(GenericAPIView):

    # POST /user/signin/
    def post(self): # def post(self, request):
        return Response("signin", status=status.HTTP_200_OK)


class UserLogoutView(GenericAPIView):

    # POST /user/signout/
    def post(self): # def post(self, request):
        return Response("signout", status=status.HTTP_200_OK)


class UserViewSet(viewsets.GenericViewSet):
    '''
        UserViewSet
    '''

    # GET /user/me/
    def retrieve(self): # def retrieve(self, request, pk=None):
        return Response("get me", status=status.HTTP_200_OK)

    # PUT /user/me/
    @transaction.atomic
    def update(self): # def update(self, request, pk=None):
        return Response("put me", status=status.HTTP_200_OK)

    # GET/POST /user/:id/badges/
    @action(detail=True, methods=["GET", "POST"])
    @transaction.atomic
    def badges(self): # def badges(self, request, pk=None):
        if self.request.method == "GET":
            return Response("get badges", status=status.HTTP_200_OK)

        if self.request.method == "POST":
            return Response("post badges", status=status.HTTP_201_CREATED)

    # GET/PUT /user/:id/radius/
    @action(detail=True, methods=["GET", "PUT"])
    @transaction.atomic
    def radius(self): # def radius(self, request, pk=None):
        if self.request.method == "GET":
            return Response("get radius", status=status.HTTP_200_OK)

        if self.request.method == "PUT":
            return Response("put radius", status=status.HTTP_200_OK)

    # GET/PUT /user/:id/achievement/
    @action(detail=True, methods=["GET", "PUT"])
    @transaction.atomic
    def achievement(self): # def achievement(self, request, pk=None):
        if self.request.method == "GET":
            return Response("get achievement", status=status.HTTP_200_OK)

        if self.request.method == "PUT":
            return Response("put achievement", status=status.HTTP_200_OK)

    # GET /user/:id/report/
    @action(detail=True)
    @transaction.atomic
    def report(self): # def report(self, request, pk=None):
        return Response("get report", status=status.HTTP_200_OK)

    # GET /user/:id/post/
    @action(detail=True)
    @transaction.atomic
    def post(self): # def post(self, request, pk=None):
        return Response("get post", status=status.HTTP_200_OK)




