from django.shortcuts import render
from django.http import HttpResponse,HttpResponseRedirect
from .forms import *
from .models import *
from django.db import transaction
import django
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
import os
import jinja2 
import json
import random
from django.db.models import *
from django.template.loader import render_to_string
#import html.parser
from django.conf import settings
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly


class KrajSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kraj
        fields = '__all__'

class WojewodztwoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wojewodztwo
        fields = '__all__'

class OkregSerializer(serializers.ModelSerializer):
    class Meta:
        model = Okreg
        fields = '__all__'

class GminaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gmina
        fields = '__all__'


class GroupDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        group = DBHandler.get_group_from_id(pk)
        words = DBHandler.get_words_from_group(group)
        serializer = GroupSerializer(group, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk):
        group = DBHandler.get_group_from_id(pk)
        serializer = GroupSerializer(group, data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    def delete(self, request, pk):
        group = DBHandler.get_group_from_id(pk)
        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def test(request):
    x = request.GET["name"]
    return JsonResponse({x: x})
@csrf_exempt
def index(request):
    kraj = Kraj.objects.all()[0]
    title = 'Cały kraj'
    return renderHTML(request,kraj, title, kraj=True)
@csrf_exempt
def wojewodztwo(request, wojewodztwo_name):
    woj = Wojewodztwo.objects.get(name=wojewodztwo_name)
    title = 'Wojewodztwo {0}'.format(woj.name)
    return renderHTML( request, woj, title)
@csrf_exempt
def okreg(request, okreg_name):
    okr = Okreg.objects.get(name=okreg_name)
    title = 'Okreg {0}'.format(okr.name)
    return renderHTML(request ,okr, title)
@csrf_exempt
def gmina(request, gmina_name):
    gm = Gmina.objects.get(code=gmina_name)
    title = 'Gmina {0}'.format(gm.name)
    return JsonResponse(request,gm, title,simple=True)



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
                gmina1.valid_votes+=sum
                gmina1.save()
                okreg1, _ = Okreg.objects.get_or_create(name = gmina1.okreg)
                okreg1.valid_votes+=sum
                okreg1.save()
                woje1, _ = Wojewodztwo.objects.get_or_create(name = okreg1.wojewodztwo)
                woje1.valid_votes+=sum
                woje1.save()
                kraj, _ = Kraj.objects.get_or_create(name = 'Polska')
                kraj.valid_votes+=sum
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


from django.template.response import TemplateResponse


def getinfo(request, lvl , name1):
    region = Kraj.objects.get(name = "Polska")
    if (lvl == "0"):
        region = Kraj.objects.get(name = "Polska")
        return JsonResponse(KrajSerializer(region).data)
    if (lvl == "1") :
        region = Wojewodztwo.objects.get(name = name1)
        return JsonResponse((WojewodztwoSerializer(region).data))
    if (lvl == "2") :
        region = Okreg.objects.get(name = name1)
        return JsonResponse((OkregSerializer(region).data))
    if (lvl == "3") :
        region = Gmina.objects.get(name = name1)
        return JsonResponse((GminaSerializer(region).data))
    



def renderHTML(request , region, title, kraj=False , simple = False):
    q = region.buildQ()
    vals = {
            'title': title,
            'data_pie' : buildPieChartData(q),
            }
    json_data = json.dumps(vals)
    return JsonResponse(json_data,safe=False)
    try:
        vals['region_info'] =  JSONRenderer().render(KrajSerializer(region).data)
    except Exception:
        zxc=123
    try:
        vals['region_info'] =  JSONRenderer().render(WojewodztwoSerializer(region).data)
    except Exception:
        zxc=123
    try:
        vals['region_info'] =  JSONRenderer().render(OkregSerializer(region).data)
    except Exception:
        zxc=123
    try:
        vals['region_info'] =  JSONRenderer().render(GminaSerializer(region).data)
    except Exception:
        zxc=123
    if simple:
        vals['change'] = 'change'
    else:
            if kraj:
                vals['data'] = buildMapData()
            vals['regions_data'] =  (region.subunit().objects.filter(q))
            vals['unit'] = region.subunit_str;
    json_data = json.dumps(vals)
    return JsonResponse(json_data)






def getCandidatesAndVotes(q=Q()):
    candidates = Candidate.objects.all().order_by('name')
    votes = list(map(lambda c: Vote.objects.filter(q).filter(
        candidate=c).aggregate(Sum('votes'))['votes__sum'], candidates))
    total = list(zip(candidates, votes))
    return total

def getPieChart(request, lvl , name1):
    region = Kraj.objects.get(name = "Polska")
    if (lvl == "0"):
        region = Kraj.objects.get(name = "Polska")
    if (lvl == "1") :
        region = Wojewodztwo.objects.get(name = name1)
    if (lvl == "2") :
        region = Okreg.objects.get(name = name1)
    if (lvl == "3") :
        region = Gmina.objects.get(name = name1)
    q = region.buildQ()

    getCandidatesAndVotes(q)

    data = {}
    cols = [{'label': 'Kandydat', 'type': 'string'},
            {'label': 'Liczba głosów', 'type': 'number'}]

    rows = []
    total = getCandidatesAndVotes(q)
    for w in total:
        vals = []
        turnout_str = '{0}'.format(round(w[1], 2))
        vals.append({'v': str(w[0]), 'f': None})
        vals.append({'v': w[1], 'f': turnout_str})
        rows.append({'c': vals})

    data['cols'] = cols
    data['rows'] = rows

    json_data = json.dumps(data, sort_keys=True, indent=4)
    return JsonResponse(dict(data),status=status.HTTP_200_OK)

def getSubunits(request, lvl , name1):
    region = Kraj.objects.get(name = "Polska")
    if (lvl == "0"):
        region = Kraj.objects.get(name = "Polska")
    if (lvl == "1") :
        region = Wojewodztwo.objects.get(name = name1)
    if (lvl == "2") :
        region = Okreg.objects.get(name = name1)
    if (lvl == "3") :
        region = Gmina.objects.get(name = name1)
    q = region.buildQ()
    vals =  list(region.subunit().objects.filter(q).values("name","max_votes" , "valid_votes"))
    json_data = {}
    json_data["result"] = vals
    
    return JsonResponse(json_data)

def buildMapData(request):
    data = {}
    cols = [{'label': 'County', 'type': 'string'},
            {'label': 'Frekwencja', 'type': 'number'}]

    rows = []

    for w in Wojewodztwo.objects.all():
        turnout = w.valid_votes / w.max_votes * 100
        vals = []
        turnout_str = '{0}%'.format(round(turnout, 2))
        vals.append({'v': w.name, 'f': None})
        vals.append({'v': turnout, 'f': turnout_str})
        rows.append({'c': vals})

    data['cols'] = cols
    data['rows'] = rows

    json_data = json.dumps(data, sort_keys=True, indent=4)
    return JsonResponse(dict(data),status=status.HTTP_200_OK)