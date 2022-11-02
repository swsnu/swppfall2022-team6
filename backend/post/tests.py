'''
    post tests
'''
from django.test import TestCase, Client

from user.models import User, Badge
#from .models import Post

class PostTestCase(TestCase):
    '''
        PostTestCase
    '''
    def setUp(self):
        badge = Badge.objects.create()
        User.objects.create_user(username='swpp', password='iluvswpp',
        main_badge=badge)

    def test_post(self):
        client = Client()
        response = client.post('/post/', data={'content':'content'})

        self.assertEqual(response.status_code, 201)

    def test_get(self):
        client = Client()
        response = client.get('/post/')

        self.assertEqual(response.status_code, 200)
