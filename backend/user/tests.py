'''
    user tests
'''
from django.test import TestCase, Client

from .models import Badge, User

class UserTestCase(TestCase):
    '''
        UserTestCase
    '''
    client = Client()

    def test_signup(self):
        response = self.client.post('/user/signup/')

        self.assertEqual(response.status_code, 201)

    def test_signin(self):
        response = self.client.post('/user/signin/')

        self.assertEqual(response.status_code, 200)

    def test_signout(self):
        response = self.client.post('/user/signout/')

        self.assertEqual(response.status_code, 200)

    def test_getme(self):
        response = self.client.get('/user/me/')

        self.assertEqual(response.status_code, 200)

    def test_putme(self):
        response = self.client.put('/user/me/')

        self.assertEqual(response.status_code, 200)

    def test_badges(self):

        response = self.client.get('/user/1/badges/')
        self.assertEqual(response.status_code, 200)

        response = self.client.post('/user/1/badges/')
        self.assertEqual(response.status_code, 201)

    def test_radius(self):

        response = self.client.get('/user/1/radius/')
        self.assertEqual(response.status_code, 200)

        response = self.client.put('/user/1/radius/')
        self.assertEqual(response.status_code, 200)

    def test_achievement(self):

        response = self.client.get('/user/1/achievement/')
        self.assertEqual(response.status_code, 200)

        response = self.client.put('/user/1/achievement/')
        self.assertEqual(response.status_code, 200)

    def test_report_post(self):

        response = self.client.get('/user/1/report/')
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        badge = Badge.objects.create()
        User.objects.create_user(
            username='swpp',
            password='iluvswpp',
            main_badge=badge
        )
        response = self.client.get('/user/1/post/')
        self.assertEqual(response.status_code, 200)
