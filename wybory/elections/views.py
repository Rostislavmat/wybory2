from django.shortcuts import render
from django.http import HttpResponse
from .forms import PostForm
from . import html_render as html
from django.views.decorators.csrf import csrf_exempt
import django
from django.http import HttpResponseRedirect
from .models import *


def search(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        q = Gmina.objects.filter(name__startswith = form.data["name_field"])
        #q = Gmina.search("B")
        vals = { 'names' : q,}
        return HttpResponse(render(request,'search.html',vals))
    else:
        form = PostForm()
        return render(request,'input.html')
def index(request):
    return HttpResponse(html.index())


def wojewodztwo(request, wojewodztwo_slug):
    return HttpResponse(html.wojewodztwo(wojewodztwo_slug))


def powiat(request, wojewodztwo_slug, powiat_slug):
    return HttpResponse(html.powiat(wojewodztwo_slug, powiat_slug))


def gmina(request, wojewodztwo_slug, powiat_slug, gmina_slug):
    return HttpResponse(html.gmina(wojewodztwo_slug, powiat_slug, gmina_slug))
