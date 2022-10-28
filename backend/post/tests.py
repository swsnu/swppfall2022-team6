from django.test import TestCase, Client
from .models import Post

class PostTestCase(TestCase):
    def test_post(self):
        client = Client()
        response = client.post('/post/')

        self.assertEqual(response.status_code, 201)

    def test_get(self):
        client = Client()
        response = client.get('/post/')

        self.assertEqual(response.status_code, 200)