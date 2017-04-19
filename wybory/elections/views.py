from django.shortcuts import render
from django.http import HttpResponse
from .forms import *
from .models import *
from django.db import transaction
import django
from django.http import HttpResponseRedirect
from .models import *
from .utility import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout

def search(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        q = Gmina.objects.filter(name__startswith = form.data["name_field"])
        vals = { 'names' : q,}
        return HttpResponse(render(request,'search.html',vals))
    else:
        form = SearchForm()
        return render(request,'input.html')

def my_login(request , gmina = "/"):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        try :
            user = User.objects.create_user(form.data["name_"], '', form.data["pass_"])
            user.save()
        except:
            None
        user = authenticate(username=form.data["name_"], password=form.data["pass_"])
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(gmina)
        else:
            return render(request,'error.html')
    else:
        form = SearchForm()
        return render(request,'login.html')

def my_logout(request):
    logout(request)
    return HttpResponseRedirect("./")


def index(request):
    kraj = Kraj.objects.all()[0]
    title = 'Cały kraj'
    return renderHTML(request,kraj, title, True)
def wojewodztwo(request, wojewodztwo_name):
    woj = Wojewodztwo.objects.get(name=wojewodztwo_name)
    title = 'Wojewodztwo {0}'.format(woj.name)
    return renderHTML( request, woj, title)
    #return index(request)
    return HttpResponse(html.wojewodztwo(request,wojewodztwo_name))
def okreg(request, okreg_name):
    okr = Okreg.objects.get(name=okreg_name)
    title = 'Okreg {0}'.format(okr.name)
    return renderHTML( request ,okr, title)
def gmina(request, gmina_name):
    gm = Gmina.objects.get(code=gmina_name)
    title = 'Gmina {0}'.format(gm.name)
    return renderSimplifiedHTML(request,gm, title)

def change(request, gmina_name):
    user = request.user
    if (user.is_authenticated):
        if request.method=='POST':
            form = SearchForm(request.POST)
            sum = 0
            with transaction.atomic():
                gmina1, _ = Gmina.objects.get_or_create(code=gmina_name)
                candidates = Candidate.objects.all()
                for candidate1 in candidates :
                    sum = sum + (int(form.data[candidate1.name+"_now"]) - int(form.data[candidate1.name+"_was"]))
                    vote, _ = Vote.objects.get_or_create(gmina__code=gmina_name,candidate=candidate1)
                    vote.votes = int(form.data[candidate1.name+"_now"])
                    vote.save()
                gmina1.max_votes+=sum
                gmina1.save()
                okreg1, _ = Okreg.objects.get_or_create(name = gmina1.okreg)
                okreg1.max_votes+=sum
                okreg1.save()
                woje1, _ = Wojewodztwo.objects.get_or_create(name = okreg1.wojewodztwo)
                woje1.max_votes+=sum
                woje1.save()
                kraj, _ = Kraj.objects.get_or_create(name = 'Polska')
                kraj.max_votes+=sum
                kraj.save()
            return HttpResponseRedirect("/gmina/"+gmina_name)
        else:
            form = SearchForm()
            gmina1, _ = Gmina.objects.get_or_create(code=gmina_name)
            vals = {'gmina': "..",
            'candidates': Vote.objects.filter(gmina__code = gmina_name)
            }
            return render(request,'change.html',vals)
    else:
        return my_login(request,"/gmina/"+gmina_name+ "/change/")



