'''
    report tests
'''
from datetime import datetime
import json
from django.test import TestCase, Client
from report.models import Report

from user.models import User, Badge
#from .models import Report

class ReportTestCase(TestCase):
    '''
        ReportTestCase
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


    def test_post(self):
        response = self.client.post('/report/', json.dumps({
            'weather':'Sunny',
            'weather_degree':1,
            'wind_degree':2,
            'happy_degree':3,
            'humidity_degree':4,
            'latitude': 30,
            'longitude': 30,
        }), content_type='application/json')

        self.assertEqual(response.status_code, 201)

    def test_get(self):
        user = User.objects.get(id=1)
        new_report = Report.objects.create(
            user=user,
            weather=0,
            weather_degree=1,
            wind_degree=2,
            happy_degree=3,
            humidity_degree=4,
            latitude=30.0,
            longitude=30.0,
            created_at=datetime.now()
        )
        new_report.save()

        response = self.client.get('/report/', {
            'latitude':30,
            'longitude':30,
        })
        self.assertEqual(response.status_code, 400)

        response = self.client.get('/report/', {
            'longitude':30,
            'radius':2
        })
        self.assertEqual(response.status_code, 400)

        response = self.client.get('/report/', {
            'latitude':30,
            'radius':2
        })
        self.assertEqual(response.status_code, 400)

        response = self.client.get('/report/', {
            'latitude':30,
            'longitude':30,
            'radius':2
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('4', response.content.decode())
