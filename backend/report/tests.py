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
    def test_post(self):
        client = Client()
        badge = Badge.objects.create()
        User.objects.create_user(username='swpp', password='iluvswpp',
        main_badge_id=badge.id)
        response = client.post('/report/', json.dumps({
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
        badge = Badge.objects.create()
        user = User.objects.create_user(
            username='swpp',
            password='iluvswpp',
            main_badge_id=badge.id
        )
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
        client = Client()
        response = client.get('/report/', {
            'latitude':30,
            'longitude':30,
            'radius':2
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('4', response.content.decode())
