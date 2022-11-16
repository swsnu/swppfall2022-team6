'''
    user models
'''
from django.db import models
from django.contrib.auth.models import AbstractUser


class Badge(models.Model):
    title = models.CharField(max_length=50, default='')
    stage = models.PositiveSmallIntegerField(null=True, blank=True)
    image = models.ImageField(upload_to='badge', null=True) # ??

    class Meta:
        db_table = 'badge'


class User(AbstractUser):
    email = models.EmailField(unique=True)
    radius = models.FloatField(default=0)
    main_badge = models.ForeignKey(Badge, related_name='user', \
        on_delete=models.CASCADE, default=1)

    class Meta:
        db_table = 'user'


class Achievement(models.Model):
    user = models.ForeignKey(User, related_name='achievement', \
        on_delete=models.CASCADE)
    visit_count = models.PositiveIntegerField(default=0)


class UserBadge(models.Model):
    user = models.ForeignKey(User, related_name='userbadge', \
        on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, related_name='userbadge', \
        on_delete=models.CASCADE)


