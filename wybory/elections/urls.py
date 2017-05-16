from django.conf.urls import url

from django.conf import settings

from . import views

app_name = 'elections'




urlpatterns = [
    url(r'logout$' , views.my_logout , name = "logout"),
    url(r'^$', views.index, name='index'),
    url(r'^woje/(?P<wojewodztwo_name>[^/]+)/$', views.wojewodztwo, name='wojewodztwo'),
    url(r'^okreg/(?P<okreg_name>[^/]+)/$', views.okreg, name='okreg'),
    url(r'^gmina/(?P<gmina_name>[^/]+)/$', views.gmina, name='gmina'),
    url(r'^gmina/(?P<gmina_name>[^/]+)/change/$', views.change, name='zmiana'),
    url(r'^info/(?P<lvl>[^/]+)/(?P<name1>[^/]+)/(?P<okreg1>[^/]+)/$', views.getinfo),
    url(r'^pie/(?P<lvl>[^/]+)/(?P<name1>[^/]+)/(?P<okreg>[^/]+)/$', views.getPieChart),
    url(r'^data/(?P<lvl>[^/]+)/(?P<name1>[^/]+)/(?P<okreg>[^/]+)/$', views.getSubunits),
    url(r'^data/(?P<gmina>[^/]+)/(?P<okreg>[^/]+)/(?P<candidate>[^/]+)/(?P<new_value>[^/]+)/(?P<login>[^/]+)/(?P<password>[^/]+)/$', views.change),
    url(r'^login/(?P<login1>[^/]+)/(?P<password1>[^/]+)/$', views.my_login),
    url(r'^search/(?P<name1>[^/]+)/$', views.search),
    url(r'test',views.test),
    url(r'map',views.buildMapData),
]
