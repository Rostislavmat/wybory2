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
        vals = { 'names' : q,}
        return HttpResponse(render(request,'search.html',vals))
    else:
        form = PostForm()
        return render(request,'input.html')



def index(request):
    return HttpResponse(html.index(request))
def wojewodztwo(request, wojewodztwo_name):
    return HttpResponse(html.wojewodztwo(request,wojewodztwo_name))
def okreg(request, okreg_name):
    return HttpResponse(html.okreg(request,okreg_name))
def gmina(request, gmina_name):
    return HttpResponse(html.gmina(request,gmina_name))
