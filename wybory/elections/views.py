from django.shortcuts import render
from django.http import HttpResponse
from .forms import PostForm
from . import html_render as html
from django.views.decorators.csrf import csrf_exempt
import django


@csrf_exempt
def search(request):
    token1 = django.middleware.csrf.get_token(request)
    if request.method == 'POST':
        form = PostForm(request.POST)
        print(form)
        return HttpResponseRedirect("/search/")
    else:
        form = PostForm()
        return HttpResponse(html.input(token1))
def index(request):
    return HttpResponse(html.index())


def wojewodztwo(request, wojewodztwo_slug):
    return HttpResponse(html.wojewodztwo(wojewodztwo_slug))


def powiat(request, wojewodztwo_slug, powiat_slug):
    return HttpResponse(html.powiat(wojewodztwo_slug, powiat_slug))


def gmina(request, wojewodztwo_slug, powiat_slug, gmina_slug):
    return HttpResponse(html.gmina(wojewodztwo_slug, powiat_slug, gmina_slug))
