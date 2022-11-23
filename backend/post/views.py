'''
    post views
'''
from datetime import datetime
from django.db import transaction
from django.shortcuts import get_object_or_404
#from django.shortcuts import redirect
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from user.models import User
from post.models import Post, PostHashtag
from hashtag.models import Hashtag
from .serializer import PostSerializer
# from haversine import haversine
# from collections import Counter

#from rest_framework.decorators import action

class PostViewSet(viewsets.GenericViewSet):
    '''
        PostViewSet
    '''
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, )

    # POST /post/
    @transaction.atomic
    def create(self, request):
        post=Post.objects.create(user=User.objects.get(id=1),
        content=request.POST['content'],
        image=request.FILES['image'] if 'image' in request.FILES else None,
        latitude=37.0, longitude=127.0, created_at=datetime.now(),
        reply_to=Post.objects.get(id=int(request.POST['replyTo']))
        if 'replyTo' in request.POST else None)
        if request.POST['hashtags'] != '':
            for hashtag in request.POST['hashtags'].strip().split(' '):
                hashtag = hashtag.lstrip('#')
                h = Hashtag.objects.filter(content=hashtag).first()
                if h is None:
                    h = Hashtag.objects.create(content=hashtag)
                PostHashtag.objects.create(post=post, hashtag=h)
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

        # coordinate = (float(latitude),float(longitude))
        # TODO: filter by created_at
        all_posts = Post.objects.all()
        # ids = [post.id for post in all_posts
        #     if haversine(coordinate, (post.latitude, post.longitude))
        #     <= float(radius)]
        ids = [post.id for post in all_posts]

        posts = all_posts.filter(id__in=ids).order_by('-created_at')

        post_hashtags = [Hashtag.objects.filter(posthashtag__post=post).values()
        for post in posts if Hashtag.objects.filter(posthashtag__post=post)]
        hashtags = []
        keys = []
        for hashtag_ls in post_hashtags:
            for hashtag in hashtag_ls:
                if hashtag['id'] not in keys:
                    hashtags.append(hashtag)
                    keys.append(hashtag['id'])

        #hashtag_count = Counter(hashtags)
        #hashtags = sorted(set(hashtags), key=lambda x: -hashtag_count[x])[:3]
        hashtags = hashtags[:3]

        data = {}
        data['posts'] = self.get_serializer(posts, many=True).data
        data['top3_hashtags'] = hashtags

        return Response(
            data,
            status=status.HTTP_200_OK
        )

    # GET /post/:id/hashfeed/
    @action(detail=True)
    def hashfeed(self, request, pk=None):
        del request
        post_hashtags = PostHashtag.objects.all()
        ids = list((ph.post.id for ph in post_hashtags
        if ph.hashtag.id == int(pk)))

        posts = Post.objects.all().filter(id__in=ids).order_by('-created_at')

        post_hashtags = [Hashtag.objects.filter(posthashtag__post=post).values()
        for post in posts if Hashtag.objects.filter(posthashtag__post=post)]
        keys = [int(pk)]
        hashtags = []
        for hashtag_ls in post_hashtags:
            for hashtag in hashtag_ls:
                if hashtag['id'] not in keys:
                    keys.append(hashtag['id'])
                    hashtags.append(hashtag)
        hashtags = hashtags[:3]


        data = {}
        data['top3_hashtags'] = hashtags
        data['posts'] = self.get_serializer(posts, many=True).data

        return Response(
            data,
            status=status.HTTP_200_OK
        )

    # GET /post/:id/
    def retrieve(self, request, pk=None):
        # if not user.is_authenticated:
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)
        del request
        post = get_object_or_404(Post, pk=pk)
        post_info = self.get_serializer(post, many=False).data
        # user_info = {'user_name': post.user.username}
        replies = Post.objects.filter(reply_to=post)
        reply_info = self.get_serializer(replies, many=True).data
        data = {}
        data['post'] = post_info
        data['replies'] = reply_info
        return Response(
                data,
                status=status.HTTP_200_OK
        )

    # GET /post/:id/chain/
    @transaction.atomic
    @action(detail=True)
    def chain(self, request, pk=None):
        # if not user.is_authenticated:
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)
        del request
        post = get_object_or_404(Post, pk=pk)
        # Add chained posts in order
        chain = []
        while post.reply_to:
            reply_id = post.reply_to.id
            reply_post = Post.objects.get(id=reply_id)
            chain.append(reply_post)
            post = reply_post
        return Response(
            self.get_serializer(chain, many=True).data,
            status=status.HTTP_200_OK
        )
