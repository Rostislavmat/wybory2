from django.conf.urls import url

from django.conf import settings

from . import views

app_name = 'elections'


urlpatterns = [
    url(r'^search/$' , views.search , name = "wyszukiwanie"),
    url(r'^$', views.index, name='index'),
    url(r'^woje/(?P<wojewodztwo_name>[^/]+)/$', views.wojewodztwo, name='wojewodztwo'),
    url(r'^okreg/(?P<okreg_name>[^/]+)/$', views.okreg, name='okreg'),
    url(r'^gmina/(?P<gmina_name>[^/]+)/$', views.gmina, name='gmina'),
]
