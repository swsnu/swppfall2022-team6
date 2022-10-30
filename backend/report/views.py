'''
    report views
'''
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets
from rest_framework.response import Response
from report.models import Report
#from rest_framework.decorators import action

class ReportViewSet(viewsets.GenericViewSet):
    '''
        ReportViewSet
    '''
    # POST /report/
    @transaction.atomic
    def create(self, request):
        del request
        return Response("create report", status=status.HTTP_201_CREATED)

    # GET /report/
    def list(self, request):
        latitude = request.GET["latitude"]
        longitude = request.GET["longitude"]
        radius = request.GET["radius"]
        # reports = Report.objects.filter(latitude <= latitude + radius and
        # latitude >= latitude - radius and longitude <= longitude + radius and
        # longitude >= longitude - radius)
        del latitude
        del longitude
        del radius
        reports = Report.objects.all()
        ret_reports = [{"weather": report.weather,
        "weather_degree": report.weather_degree,
        "wind_degree": report.wind_degree,
        "happy_degree": report.happy_degree,
        "humidity_degree": report.humidity_degree} for report in reports]
        return Response(ret_reports, status=status.HTTP_200_OK)
