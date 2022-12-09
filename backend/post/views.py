'''
    post views
'''
from datetime import datetime
from django.db import transaction
from django.shortcuts import get_object_or_404
from user.models import User
#from django.shortcuts import redirect
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from post.models import Post, PostHashtag
from hashtag.models import Hashtag
from .serializer import PostSerializer
from haversine import haversine
from collections import Counter

#from rest_framework.decorators import action
MAX_POST_LEN = 30

def hash_recommend(posts, user, pk=0):
    post_hashtags = [Hashtag.objects.filter
    (posthashtag__post__id=post['id']).all()
    for post in posts]

    #unique hashtags in posts
    keys = [pk] if pk != 0 else []
    hashtags = []
    for hashtag_ls in post_hashtags:
        for hashtag in hashtag_ls:
            if hashtag.id not in keys:
                keys.append(hashtag.id)
                hashtags.append(hashtag)

    #hashtag user wrote
    my_hashtag = []
    for hlist in [p.posthashtag.values_list('hashtag')
    for p in user.userpost.all()]:
        for hid in hlist:
            my_hashtag.append(hid)
    my_hashtag = set(my_hashtag)

    h_scores = []
    for hashtag in hashtags:
        #which user wrote this hashtag how much
        h_posts = hashtag.posthashtag.values_list('post__user')
        users_hashtag = []
        for ulist in h_posts:
            for uid in ulist:
                users_hashtag.append(uid)
        users_hashtag = Counter(users_hashtag)

        score = 0
        for uid, item in users_hashtag.items():
            if uid == user.id: continue
            #len of common hashtags
            u_hashtag = []
            for hlist in [p.posthashtag.values_list('hashtag')
            for p in User.objects.get(id=uid).userpost.all()]:
                for hid in hlist:
                    u_hashtag.append(hid)
            sim = len(my_hashtag.intersection(set(u_hashtag)))
            #len of this hashtag u wrote
            cnt = item
            score += sim * cnt
        h_scores.append([hashtag, 0.5*score+0.5*len(h_posts)])
    h_scores.sort(key=lambda x: -x[1])

    return [{'id':h[0].id, 'content':h[0].content} for h in h_scores[:3]]

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
        user = request.user
        print('before create')
        post=Post.objects.create(user=user,
        content=request.POST['content'],
        image=request.FILES['image'] if 'image' in request.FILES else None,
        latitude=request.POST['latitude'],
        longitude=request.POST['longitude'],
        location=request.POST['location'],
        created_at=datetime.now(),
        reply_to=Post.objects.get(id=int(request.POST['replyTo']))
        if 'replyTo' in request.POST else None)
        print('after create')
        hashid = ''
        if 'hid' in request.POST:
            hashid = Hashtag.objects.get(id=int(request.POST['hid']))
            PostHashtag.objects.create(post=post, hashtag=hashid)
            hashid = hashid.content
        if request.POST['hashtags'] != '':
            for hashtag in request.POST['hashtags'].strip().replace('#', ' ').split(' '):
                #hashtag = hashtag.lstrip('#')
                if hashtag == hashid: continue
                h = Hashtag.objects.filter(content=hashtag).first()
                if h is None:
                    h = Hashtag.objects.create(content=hashtag)
                PostHashtag.objects.create(post=post, hashtag=h)
        return Response(self.get_serializer(post, many=False).data, status=status.HTTP_201_CREATED)

    # GET /post/
    def list(self, request):
        # user = request.user
        user = User.objects.get(id=1)

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
        #ids = [post.id for post in all_posts]

        posts = all_posts.filter(id__in=ids).order_by('-created_at')[:MAX_POST_LEN]

        # post_hashtags =
        # [Hashtag.objects.filter(posthashtag__post=post).values()
        # for post in posts if Hashtag.objects.filter(posthashtag__post=post)]
        # hashtags = []
        # keys = []
        # for hashtag_ls in post_hashtags:
        #     for hashtag in hashtag_ls:
        #         if hashtag['id'] not in keys:
        #             hashtags.append(hashtag)
        #             keys.append(hashtag['id'])

        #hashtag_count = Counter(hashtags)
        #hashtags = sorted(set(hashtags), key=lambda x: -hashtag_count[x])[:3]
        hashtags = hash_recommend(posts.values('id'), user)

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
        user = User.objects.get(id=1)
        post_hashtags = PostHashtag.objects.all()
        ids = list((ph.post.id for ph in post_hashtags
        if ph.hashtag.id == int(pk)))

        posts = Post.objects.all().filter(id__in=ids).order_by('-created_at')[:MAX_POST_LEN]

        # post_hashtags =
        # [Hashtag.objects.filter(posthashtag__post=post).values()
        # for post in posts if Hashtag.objects.filter(posthashtag__post=post)]
        # keys = [int(pk)]
        # hashtags = []
        # for hashtag_ls in post_hashtags:
        #     for hashtag in hashtag_ls:
        #         if hashtag['id'] not in keys:
        #             keys.append(hashtag['id'])
        #             hashtags.append(hashtag)
        content = get_object_or_404(Hashtag, pk=int(pk))
        hashtags = hash_recommend(posts.values('id'), user, int(pk))
        hashtags.insert(0, {'id':pk,
        'content':content.content})

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
        replies = Post.objects.filter(reply_to=post)[:MAX_POST_LEN]
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
        replen = 0
        while post.reply_to and replen < MAX_POST_LEN:
            reply_id = post.reply_to.id
            reply_post = Post.objects.get(id=reply_id)
            chain.append(reply_post)
            post = reply_post
            replen += 1
        return Response(
            self.get_serializer(chain, many=True).data,
            status=status.HTTP_200_OK
        )
