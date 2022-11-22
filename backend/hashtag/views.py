'''
    hashtag view
'''
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
#from rest_framework.decorators import action

from hashtag.models import Hashtag

class HashtagViewSet(viewsets.GenericViewSet):
    permission_classes = (permissions.IsAuthenticated, )

    # POST /hashtag/
    @transaction.atomic
    def create(self, request):
        Hashtag.objects.create(
            content=request.POST['content'],
        )
        return Response('create hashtag', status=status.HTTP_201_CREATED)
