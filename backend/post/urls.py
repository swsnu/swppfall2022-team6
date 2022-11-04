'''
    post urls
'''
from django.urls import include, path
from rest_framework.routers import SimpleRouter
from post.views import PostViewSet, PostDetailView, PostChainView


app_name = 'post'

router = SimpleRouter()
router.register('post', PostViewSet, basename='post')

urlpatterns = [
    path('post/<int:id>/', PostDetailView.as_view(), name='detail'),
    path('post/<int:id>/chain/', PostChainView.as_view(), name='chain'),
    path('', include((router.urls))),
]