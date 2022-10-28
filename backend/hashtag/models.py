'''
    hashtag model
'''
from django.db import models

class Hashtag(models.Model):
    content = models.CharField(max_length=20, default="")
# Create your models here.
