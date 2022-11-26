'''
    user tests
'''
from django.test import TestCase, Client
from .models import Badge

class UserTestCase(TestCase):
    '''
        UserTestCase
    '''
    client = Client()

    def setUp(self) -> None:
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


    def test_signup(self):
        data = {
            'username': 'username',
            'email': 'email@email.com',
            'password': 'password'
        }
        response = self.client.post('/user/signup/'
                    ,data=data)

        self.assertEqual(response.status_code, 201)

    def test_signin(self):
        self.client.post('/user/signout/')

        data = {
            'email': 'temporary@gmail.com',
            'password': 'temporary'
        }
        response = self.client.post('/user/signin/'
                    ,data=data)

        self.assertEqual(response.status_code, 200)

        data = {
            'password': 'temporary'
        }
        response = self.client.post('/user/signin/'
                    ,data=data)

        self.assertEqual(response.status_code, 400)

        data = {
            'email': 'temporary@gmail.com',
            'password': 'invalid'
        }
        response = self.client.post('/user/signin/'
                    ,data=data)

        self.assertEqual(response.status_code, 403)

    def test_signout(self):
        response = self.client.post('/user/signout/')

        self.assertEqual(response.status_code, 200)

    def test_getusers(self):
        response = self.client.get('/user/')
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
        # badge = Badge.objects.create()
        # User.objects.create_user(
        #     username='swpp',
        #     password='iluvswpp',
        #     main_badge=badge
        # )
        response = self.client.get('/user/1/post/')
        self.assertEqual(response.status_code, 200)
