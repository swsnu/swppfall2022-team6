'''
    hashtag view
'''
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
#from django.shortcuts import redirect
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
#from rest_framework.decorators import action

from hashtag.models import Hashtag

class HashtagViewSet(viewsets.GenericViewSet):
    '''
        HashtagViewSet
    '''
    permission_classes = (permissions.IsAuthenticated, )

    # POST /hashtag/
    @transaction.atomic
    def create(self, request):
        Hashtag.objects.create(
            content=request.POST['content'],
        )
        return Response('create hashtag', status=status.HTTP_201_CREATED)

    # GET /hashtag/
    def list(self, request):
        content = request.query_params.get('content')
        if not content:
            return Response(
                { 'error': 'content missing' },
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            myhashid = Hashtag.objects.values_list('id', 'content')\
                .get(content=content)[0]
        except ObjectDoesNotExist:
            myhashid = None
        return Response(myhashid, status=status.HTTP_200_OK)
