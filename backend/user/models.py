'''
    user models
'''
from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken


BADGE_NUM = 6
class Badge(models.Model):
    title = models.CharField(max_length=50, default='')
    requirement = models.PositiveSmallIntegerField(null=True, blank=True)
    description = models.CharField(max_length=100, default='')
    # stage = models.PositiveSmallIntegerField(null=True, blank=True)
    image = models.ImageField(upload_to='badge', null=True) # ??

    class Meta:
        db_table = 'badge'


class User(AbstractUser):
    '''
        User
    '''
    email = models.EmailField(unique=True)
    radius = models.FloatField(default=2)
    main_badge = models.ForeignKey(Badge, related_name='user', \
        on_delete=models.CASCADE, default=1)

    # 유저의 토큰을 생성할 때 사용합니다.
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
    class Meta:
        db_table = 'user'


class UserBadge(models.Model):
    user = models.ForeignKey(User, related_name='userbadge', \
        on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, related_name='userbadge', \
        on_delete=models.CASCADE)
    is_fulfilled = models.BooleanField(default=False)

class Achievement(models.Model):
    userbadge = models.OneToOneField(UserBadge, related_name='achievement', \
        on_delete=models.CASCADE)
    status = models.PositiveIntegerField(default=0)


