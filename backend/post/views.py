'''
    post views
'''
from datetime import datetime
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from user.models import User
from post.models import Post, Hashtag
from .serializer import PostSerializer
from haversine import haversine
import numpy as np
from collections import Counter

#from rest_framework.decorators import action

class PostViewSet(viewsets.GenericViewSet):
    '''
        PostViewSet
    '''
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    # POST /post/
    @transaction.atomic
    def create(self, request):
        Post.objects.create(user=User.objects.get(id=1),
        content=request.POST['content'],
        image=request.FILES['image'] if 'image' in request.FILES else None,
        latitude=37.0, longitude=127.0, created_at=datetime.now(),
        reply_to=Post.objects.get(id=int(request.POST['replyTo']))
        if 'replyTo' in request.POST else None)
        return Response('create post', status=status.HTTP_201_CREATED)

    # GET /post/
    def list(self, request):
        # user = request.user
        # if not user.is_authenticated:
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)

        # Query Params
        radius = request.query_params.get('radius')
        if not radius:
            return Response(
                { 'error': 'radius missing' },
                status=status.HTTP_400_BAD_REQUEST
            )

        latitude = request.query_params.get('latitude')
        if not latitude:
            return Response(
                {'error': 'latitude missing'},
                status=status.HTTP_400_BAD_REQUEST
            )

        longitude = request.query_params.get('longitude')
        if not longitude:
            return Response(
                {'error': 'longitude missing'},
                status=status.HTTP_400_BAD_REQUEST
            )

        coordinate = (float(latitude),float(longitude))
        # TODO: filter by created_at
        all_posts = Post.objects.all()
        ids = [post.id for post in all_posts
            if haversine(coordinate, (post.latitude, post.longitude))
            <= float(radius)]

        posts = all_posts.filter(id__in=ids).order_by('-created_at')

        post_hashtags = [Hashtag.objects.filter(posthashtag__post=post).values() for post in posts if Hashtag.objects.filter(posthashtag__post=post)]
        hashtags = []
        for hashtag_ls in post_hashtags:
            for hashtag in hashtag_ls:
                hashtags.append(hashtag['content'])

        hashtag_count = Counter(hashtags)
        hashtags = sorted(set(hashtags), key=lambda x: -hashtag_count[x])[:3]

        data = {}
        data['posts'] = self.get_serializer(posts, many=True).data
        data['top3_hashtags'] = hashtags


        # hashtags = np.array([dict([post['hashtags']]) for post in posts if post['hashtags']], dtype = object)
        # print(hashtags.ravel())
        # hashtags = [hashtag['content'] for hashtag in hashtags]
        # hashtag_count = Counter(hashtags)
        # hashtag_count = hashtag_count.most_common[3]
        # print(hashtag_count)

        return Response(
            data,
            status=status.HTTP_200_OK
        )

class PostDetailView(GenericAPIView):
    '''
    post detail views
    '''
    serializer_class = PostSerializer
    # GET /post/:id/
    def get(self, request, post_id):
        # if not user.is_authenticated:
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)
        if request.method == 'GET':
            if Post.objects.filter(id=post_id).exists():
                post = Post.objects.get(id=post_id)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
            return Response(
                self.get_serializer(post, many=False).data,
                status=status.HTTP_200_OK
            )

class PostChainView(GenericAPIView):
    '''
    Post Chain Views
    '''
    serializer_class = PostSerializer
    # GET /post/:id/chain
    def get(self, request, post_id):
        if request.method == 'GET':
            # if not user.is_authenticated:
            #     return Response(status=status.HTTP_401_UNAUTHORIZED)
            if Post.objects.filter(id=post_id).exists():
                post = Post.objects.get(id=post_id)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
            # Add chained posts in order
            chain = []
            reply_id = post.reply_to.id
            while reply_id is not None:
                reply_post = Post.objects.get(id=reply_id)
                chain.append(reply_post)
                reply_id = reply_post.reply_to
            return Response(
                self.get_serializer(chain, many=True).data,
                status=status.HTTP_200_OK
            )
