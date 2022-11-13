'''
    ReportSerializer
'''
from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    '''
        ReportSerializer
    '''
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = (
            'id',
            'user_name',
            'weather',
            'weather_degree',
            'wind_degree',
            'happy_degree',
            'humidity_degree',
            'latitude',
            'longitude',
            'created_at',
        )
    def get_user_name(self, post):
        return post.user.username
