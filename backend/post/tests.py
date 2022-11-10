'''
    post tests
'''
from django.test import TestCase, Client
from .models import Post, PostHashtag
from user.models import User, Badge
from hashtag.models import Hashtag
from datetime import date

class PostTestCase(TestCase):
    '''
        PostTestCase
    '''
    def setUp(self):
        badge = Badge.objects.create()
        new_user = User.objects.create_user(
            username='swpp',
            password='iluvswpp',
            main_badge=badge
        )
        new_post = Post(
            user=new_user,
            content='content',
            latitude=36.0,
            longitude=128.0
        )
        new_post.save()
        new_post.created_at=date(2020, 10, 20)
        new_post.save()
        new_post2 = Post(
            user=new_user,
            content='content',
            latitude=5.0,
            longitude=12.0,
            reply_to=new_post
        )
        new_post2.save()
        new_post2.created_at=date(2020, 10, 21)
        new_post2.save()
        new_hashtag = Hashtag(content='hashtag')
        new_hashtag.save()
        new_posthashtag = PostHashtag(post=new_post, hashtag=new_hashtag)
        new_posthashtag.save()

    def test_post(self):
        client = Client()
        response = client.post('/post/',
        data={'content':'content', 'hashtags':'hi'})

        self.assertEqual(response.status_code, 201)

    def test_get(self):
        client = Client()
        # check query params
        response = client.get(
            '/post/',
            {'latitude': 37.0, 'longitude': 127.0}
        )
        self.assertEqual(response.status_code, 400)
        response = client.get(
            '/post/',
            {'radius': 143, 'longitude': 127.0}
        )
        self.assertEqual(response.status_code, 400)
        response = client.get(
            '/post/',
            {'radius': 143, 'latitude': 37.0}
        )
        self.assertEqual(response.status_code, 400)

        response = client.get(
            '/post/',
            {'radius': 143, 'latitude': 37.0, 'longitude': 127.0}
        )
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {'posts': [{'id': 1, 'user_name': 'swpp', 'content': 'content',
            'image': None,
            'latitude': 36.0, 'longitude': 128.0, 'reply_to_author': None,
            'hashtags': [{'content': 'hashtag', 'id': 1}],
            'created_at':'2020-10-20T00:00:00'}], 'top3_hashtags': ['hashtag']}
        )
    # Error-prone test
    # def test_get_detail(self):
    #     client = Client()
    #     response = client.get('/post/4/')
    #     self.assertEqual(response.status_code, 404)
    #     response = client.get('/post/2/')
    #     self.assertEqual(response.status_code, 200)
    #     self.assertJSONEqual(
    #         str(response.content, encoding='utf8'),
    #         {'post':
    #             {'id': 2, 'user': 1, 'content': 'content', 'image': None,
    #             'latitude': 5.0, 'longitude': 12.0, 'reply_to': None,
    #             'hashtags': None},
    #          'replies':
    #             [{'id': 1, 'user': 1, 'content': 'content', 'image': None,
    #             'latitude': 36.0, 'longitude': 128.0, 'reply_to': 1,
    #             'hashtags': [{'id': 1, 'content': 'hashtag'}]}]
    #         }
    #     )

    def test_get_chain(self):
        client = Client()
        response = client.get('/post/4/chain/')
        self.assertEqual(response.status_code, 404)
        response = client.get('/post/2/chain/')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            [{'id': 1, 'user_name': 'swpp', 'content': 'content', 'image': None,
            'latitude': 36.0, 'longitude': 128.0, 'reply_to_author': None,
            'hashtags': [{'content': 'hashtag', 'id': 1}],
            'created_at':'2020-10-20T00:00:00'}]
        )

    def test_retrieve(self):
        client = Client()
        response = client.get('/post/4/')
        self.assertEqual(response.status_code, 404)
        response = client.get('/post/1/')
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {'post':{'id': 1, 'user_name': 'swpp', 'content': 'content',
            'image': None,
            'latitude': 36.0, 'longitude': 128.0, 'reply_to_author': None,
            'hashtags': [{'content': 'hashtag', 'id': 1}],
            'created_at':'2020-10-20T00:00:00'},
            'replies':[{'id': 2, 'user_name': 'swpp', 'content': 'content',
            'image': None,
            'latitude': 5.0, 'longitude': 12.0, 'reply_to_author': 'swpp',
            'hashtags': [],
            'created_at':'2020-10-21T00:00:00'}]}
        )
        