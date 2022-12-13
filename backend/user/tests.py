'''
    user tests
'''
from django.test import TestCase, Client
from django_fakeredis.fakeredis import FakeRedis
from .models import Badge, User, BADGE_NUM

class UserTestCase(TestCase):
    '''
        UserTestCase
    '''
    client = Client()

    @FakeRedis('user.views.cache')
    def setUp(self) -> None:
        for i in range(1, BADGE_NUM+1):
            new_badge = Badge(title = f'title{i}', requirement=0)
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

        data = {
            'username': '*&&^$&',
            'email': 'invalid@email.com',
            'password': 'invalidpw'
        }
        response = self.client.post('/user/signup/'
                    ,data=data)

        self.assertEqual(response.status_code, 400)

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

    def test_mainbadge(self):
        data = {'main_badge': 3}
        response = self.client.post('/user/1/mainbadge/', data, \
            content_type='application/json',)
        self.assertEqual(response.status_code, 200)

    def test_radius(self):

        response = self.client.get('/user/1/radius/')
        self.assertEqual(response.status_code, 200)

        response = self.client.put('/user/1/radius/')
        self.assertEqual(response.status_code, 200)

    def test_achievement(self):
        response = self.client.get('/user/1/achievement/')
        self.assertEqual(response.status_code, 200)
        data = {'badge_id': '1'}
        response = self.client.put('/user/1/achievement/', data, \
            content_type='application/json',)

        self.assertEqual(response.status_code, 200)

    def test_report_post(self):

        response = self.client.get('/user/1/report/')
        self.assertEqual(response.status_code, 200)

    @FakeRedis('user.views.cache')
    def test_post(self):
        badge = Badge.objects.create()
        User.objects.create_user(
            username='swpp',
            password='iluvswpp',
            main_badge=badge
        )
        response = self.client.get('/user/1/post/')
        self.assertEqual(response.status_code, 200)
