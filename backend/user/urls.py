from django.urls import include, path
from rest_framework.routers import SimpleRouter
from user.views import UserSignUpView, UserLoginView, UserLogoutView, UserViewSet


app_name = 'user'

router = SimpleRouter()
router.register('user', UserViewSet, basename='user')  

urlpatterns = [
    path('user/signup/', UserSignUpView.as_view(), name='signup'),
    path('user/signin/', UserLoginView.as_view(), name='signin'),
    path('user/signout/', UserLogoutView.as_view(), name='signout'),
    path('', include((router.urls))),
]
