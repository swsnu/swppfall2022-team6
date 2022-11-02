'''
    post views
'''
from datetime import datetime
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
from user.models import User

from post.models import Post
#from rest_framework.decorators import action

class PostViewSet(viewsets.GenericViewSet):
    '''
        PostViewSet
    '''
    # POST /post/
    @transaction.atomic
    def create(self, request):
        Post.objects.create(user=User.objects.get(id=1),
        content=request.POST['content'],
        image=request.FILES['image'] if 'image' in request.FILES else None,
        latitude=30, longitude=30, created_at=datetime.now(),
        reply_to=request.POST['replyTo'] if 'replyTo' in request.POST else None)
        return Response('create post', status=status.HTTP_201_CREATED)

    # GET /post/
    def list(self, request):
        del request
        return Response('get post', status=status.HTTP_200_OK)
