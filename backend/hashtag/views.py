'''
    hashtag view
'''
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
#from rest_framework.decorators import action

from models import Hashtag

class HashtagViewSet(viewsets.GenericViewSet):
    # POST /hashtag/
    @transaction.atomic
    def create(self, request):
        Hashtag.objects.create(
            content=request.POST['content'],
        )
        return Response('create hashtag', status=status.HTTP_201_CREATED)
