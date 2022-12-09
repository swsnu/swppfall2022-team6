'''
    hashtag tests
'''
from django.test import TestCase, Client

from user.models import Badge
from hashtag.models import Hashtag
#from .models import Hashtag

class HashtagTestCase(TestCase):
    '''
        hashtag tests
    '''
    client = Client()

    def setUp(self) -> None:
        new_hashtag = Hashtag(content='content')
        new_hashtag.save()
        new_badge = Badge(title='test')
        new_badge.save()
        # TODO: remove dependency
        data = {
            'username': 'temporary',
            'email': 'temporary@gmail.com',
            'password': 'temporary'
        }
        self.client.post('/user/signup/'
                    ,data=data)
        data = {
            'email': 'temporary@gmail.com',
            'password': 'temporary'
        }
        self.client.post('/user/signin/'
                    ,data=data)

    def test_post(self):
        response = self.client.post('/hashtag/', {'content':'content'})

        self.assertEqual(response.status_code, 201)

    def test_get(self):
        response = self.client.get('/hashtag/', {})
        self.assertEqual(response.status_code, 400)
        response = self.client.get('/hashtag/', {'content':'content'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, 1)
        response = self.client.get('/hashtag/', {'content':'content2'})
        self.assertEqual(response.status_code, 200)
