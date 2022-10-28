'''
    post views
'''
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
#from rest_framework.decorators import action

class PostViewSet(viewsets.GenericViewSet):
    # POST /post/
    @transaction.atomic
    def create(self): # change when using request ; def create(self, request):
        return Response("create post", status=status.HTTP_201_CREATED)

    # GET /post/
    def list(self): # change when using request ; def create(list, request):
        return Response("get post", status=status.HTTP_200_OK)
