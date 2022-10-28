from django.db import models
from user.models import User

class Report(models.Model):
    user = models.ForeignKey(User, related_name='userreport', on_delete=models.CASCADE)
    weather = models.CharField(max_length=300, default="")
    weather_degree = models.PositiveSmallIntegerField(default=0)
    wind_degree = models.PositiveSmallIntegerField(default=0)
    happy_degree = models.PositiveSmallIntegerField(default=0)
    humidity_degree = models.PositiveSmallIntegerField(default=0)
    latitude = models.FloatField()
    longitutde = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'report'

# Create your models here.
