from django.test import TestCase, Client
from .models import Report

class ReportTestCase(TestCase):
    def test_post(self):
        client = Client()
        response = client.post('/report/')

        self.assertEqual(response.status_code, 201)

    def test_get(self):
        client = Client()
        response = client.get('/report/')

        self.assertEqual(response.status_code, 200)