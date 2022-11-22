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
        new_post.created_at=date(2020, 10, 20)
        new_post.save()

        new_post2 = Post(
            user=new_user,
            content='content',
            latitude=5.0,
            longitude=12.0,
            reply_to=new_post
        )
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
            {'radius': 2, 'longitude': 127.0}
        )
        self.assertEqual(response.status_code, 400)
        response = client.get(
            '/post/',
            {'radius': 2, 'latitude': 37.0}
        )
        self.assertEqual(response.status_code, 400)

        response = client.get(
            '/post/',
            {'radius': 2, 'latitude': 36.0, 'longitude': 128.0}
        )
        self.assertEqual(response.status_code, 200)

        data = response.json()
        posts = data['posts']
        top3hashtags = data['top3_hashtags']
        self.assertEqual(len(data), 2)

        self.assertEqual(posts[0]['id'], 2)
        self.assertEqual(posts[0]['content'], 'content')
        self.assertIsNone(posts[0]['image'])
        self.assertEqual(posts[0]['latitude'], 5.0)
        self.assertEqual(posts[0]['longitude'], 12.0)
        self.assertEqual(posts[0]['reply_to_author'], 'swpp')
        self.assertEqual(posts[0]['hashtags'], [])
        self.assertIsNotNone(posts[0]['created_at'])

        self.assertEqual(posts[1]['id'], 1)
        self.assertEqual(posts[1]['content'], 'content')
        self.assertIsNone(posts[1]['image'])
        self.assertEqual(posts[1]['latitude'], 36.0)
        self.assertEqual(posts[1]['longitude'], 128.0)
        self.assertEqual(posts[1]['reply_to_author'], None)
        self.assertEqual(
            posts[1]['hashtags'],
            [{'id': 1, 'content': 'hashtag'}]
        )
        self.assertIsNotNone(posts[1]['created_at'])

        self.assertEqual(top3hashtags, [{'id': 1, 'content': 'hashtag'}])

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

        data = response.json()
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            [{
                'id': 1,
                'user_name': 'swpp',
                'content': 'content',
                'image': None,
                'latitude': 36.0,
                'longitude': 128.0,
                'created_at': data[0]['created_at'],
                'reply_to_author': None,
                'hashtags': [{'id': 1, 'content': 'hashtag'}]
            }]
        )

    def test_hashfeed(self):
        client = Client()
        response = client.get('/post/1/hashfeed/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                'posts':
                    [{'id': 1,
                    'user_name': 'swpp',
                    'content': 'content',
                    'image': None,
                    'latitude': 36.0,
                    'longitude': 128.0,
                    'created_at': data['posts'][0]['created_at'],
                    'reply_to_author': None,
                    'hashtags': [{'id': 1, 'content': 'hashtag'}]}],
                'top3_hashtags':
                    [{'id': 1, 'content': 'hashtag'}]
            }
        )


    def test_retrieve(self):
        client = Client()
        response = client.get('/post/4/')
        self.assertEqual(response.status_code, 404)
        response = client.get('/post/1/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {
                'post':{
                    'id': 1,
                    'user_name': 'swpp',
                    'content': 'content',
                    'image': None,
                    'latitude': 36.0,
                    'longitude': 128.0,
                    'created_at': data['post']['created_at'],
                    'reply_to_author': None,
                    'hashtags': [{'id': 1, 'content': 'hashtag'}],
                    },
                'replies': [{
                    'id': 2,
                    'user_name': 'swpp',
                    'content': 'content',
                    'image': None,
                    'latitude': 5.0,
                    'longitude': 12.0,
                    'created_at': data['replies'][0]['created_at'],
                    'reply_to_author': 'swpp',
                    'hashtags': [],
                    }]
                }
        )
        