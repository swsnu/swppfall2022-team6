'''
    user urls
'''
from django.urls import include, path
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from user.views import UserSignUpView, UserLoginView, UserLogoutView, UserViewSet


app_name = 'user'

router = SimpleRouter()
router.register('user', UserViewSet, basename='user')

urlpatterns = [
    path('user/signup/', UserSignUpView.as_view(), name='signup'),
    path('user/signin/', UserLoginView.as_view(), name='signin'),
    path('user/signout/', UserLogoutView.as_view(), name='signout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('', include((router.urls))),
]
