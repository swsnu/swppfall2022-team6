'''
    report views
'''
from datetime import datetime
import json
from django.db import transaction
#from django.shortcuts import redirect
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from user.models import User
from report.models import Report
from .serializer import ReportSerializer
#from rest_framework.decorators import action
from haversine import haversine

class ReportViewSet(viewsets.GenericViewSet):
    '''
        ReportViewSet
    '''
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticated, )
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
        latitude=req_data['latitude'],
        longitude=req_data['longitude'],
        created_at=datetime.now()
        )
        return Response('create report', status=status.HTTP_201_CREATED)

    # GET /report/
    def list(self, request):
        radius = request.query_params.get('radius')
        if not radius:
            return Response(
                { 'error': 'radius missing' },
                status=status.HTTP_400_BAD_REQUEST
            )

        latitude = request.query_params.get('latitude')
        if not latitude:
            return Response(
                {'error': 'latitude missing'},
                status=status.HTTP_400_BAD_REQUEST
            )

        longitude = request.query_params.get('longitude')
        if not longitude:
            return Response(
                {'error': 'longitude missing'},
                status=status.HTTP_400_BAD_REQUEST
            )
        coordinate = (float(latitude),float(longitude))

        all_reports = Report.objects.all()
        ids = [report.id for report in all_reports
        if haversine(coordinate, (report.latitude, report.longitude))
        <= float(radius)]
        #ids = [post.id for post in all_reports]

        reports = all_reports.filter(id__in=ids).order_by('-created_at')

        data = self.get_serializer(reports, many=True).data

        # ret_reports = [{'weather': report.weather,
        # 'weather_degree': report.weather_degree,
        # 'wind_degree': report.wind_degree,
        # 'happy_degree': report.happy_degree,
        # 'humidity_degree': report.humidity_degree} for report in reports]
        return Response(data, status=status.HTTP_200_OK)
