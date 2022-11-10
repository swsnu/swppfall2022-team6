'''
    hashtag tests
'''
from django.test import TestCase, Client
#from .models import Hashtag

class HashtagTestCase(TestCase):
    def test_post(self):
        client = Client()
        response = client.post('/hashtag/', {'content':'content'})

        self.assertEqual(response.status_code, 201)
