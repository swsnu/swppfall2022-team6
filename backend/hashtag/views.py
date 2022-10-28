'''
    hashtag view
'''
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
#from rest_framework.decorators import action

class HashtagViewSet(viewsets.GenericViewSet):
    # POST /hashtag/
    @transaction.atomic
    def create(self): #change to when using request; def create(self, request):
        return Response("create hashtag", status=status.HTTP_201_CREATED)
