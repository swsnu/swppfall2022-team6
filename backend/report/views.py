'''
    report views
'''
from datetime import datetime
import json
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
from user.models import User
from report.models import Report
#from rest_framework.decorators import action

class ReportViewSet(viewsets.GenericViewSet):
    '''
        ReportViewSet
    '''
    # POST /report/
    @transaction.atomic
    def create(self, request):
        req_data = json.loads(request.body.decode())
        Report.objects.create(user=User.objects.get(id=1),
        weather=req_data['weather'],
        weather_degree=req_data['weather_degree'],
        wind_degree=req_data['wind_degree'],
        happy_degree=req_data['happy_degree'],
        humidity_degree=req_data['humidity_degree'],
        latitude=37.0, longitude=127.0, created_at=datetime.now())
        return Response('create report', status=status.HTTP_201_CREATED)

    # GET /report/
    def list(self, request):
        latitude = request.GET['latitude']
        longitude = request.GET['longitude']
        radius = request.GET['radius']
        # reports = Report.objects.filter(latitude <= latitude + radius and
        # latitude >= latitude - radius and longitude <= longitude + radius and
        # longitude >= longitude - radius)
        del latitude
        del longitude
        del radius
        reports = Report.objects.all()
        ret_reports = [{'weather': report.weather,
        'weather_degree': report.weather_degree,
        'wind_degree': report.wind_degree,
        'happy_degree': report.happy_degree,
        'humidity_degree': report.humidity_degree} for report in reports]
        return Response(ret_reports, status=status.HTTP_200_OK)
