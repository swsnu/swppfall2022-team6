from django.test import TestCase, Client
from .models import Badge, User, Achievement, UserBadge

class UserTestCase(TestCase):
    def test_signup(self):
        client = Client()
        response = client.post('/user/signup/')

        self.assertEqual(response.status_code, 201)

    def test_signin(self):
        client = Client()
        response = client.post('/user/signin/')

        self.assertEqual(response.status_code, 200)

    def test_signout(self):
        client = Client()
        response = client.post('/user/signout/')

        self.assertEqual(response.status_code, 200)
    
    def test_getme(self):
        client = Client()
        response = client.get('/user/me/')

        self.assertEqual(response.status_code, 200)
    
    def test_putme(self):
        client = Client()
        response = client.put('/user/me/')

        self.assertEqual(response.status_code, 200)
    
    def test_badges(self):
        client = Client()

        response = client.get('/user/1/badges/')
        self.assertEqual(response.status_code, 200)

        response = client.post('/user/1/badges/')
        self.assertEqual(response.status_code, 201)

    def test_radius(self):
        client = Client()

        response = client.get('/user/1/radius/')
        self.assertEqual(response.status_code, 200)

        response = client.put('/user/1/radius/')
        self.assertEqual(response.status_code, 200)
    
    def test_achievement(self):
        client = Client()

        response = client.get('/user/1/achievement/')
        self.assertEqual(response.status_code, 200)

        response = client.put('/user/1/achievement/')
        self.assertEqual(response.status_code, 200)
    
    def test_report_post(self):
        client = Client()

        response = client.get('/user/1/report/')
        self.assertEqual(response.status_code, 200)

        response = client.get('/user/1/post/')
        self.assertEqual(response.status_code, 200)


