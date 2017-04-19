import os
import jinja2
import json
import random

from elections.models import *
from django.db.models import *
from functools import reduce
from django.shortcuts import render
from django.template.loader import render_to_string
import html.parser
from django.conf import settings

def renderHTML(request , region, title, kraj=False , simple = False):
    q = region.buildQ()
    vals = {'region_info': region,
            'title': title,
            'data_pie' : buildPieChartData(q),
            }
    if simple:
        vals['change'] = 'change'
    else:
            if kraj:
                vals['data'] = buildMapData()
            vals['regions_data'] =  (region.subunit().objects.filter(q))
            vals['unit'] = region.subunit_str;
    return render(request,'stats.html', vals)




def buildMapData():
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
    return json_data


def getCandidatesVotes(candidates, q=Q()):
    votes = list(map(lambda c: Vote.objects.filter(q).filter(
        candidate=c).aggregate(Sum('votes'))['votes__sum'], candidates))
    total = reduce(lambda x, y: x + y, votes)
    votes = list(map(lambda c: c, votes))
    return votes


def getCandidates():
    return Candidate.objects.all().order_by('name')





def getCandidatesAndVotes(q=Q()):
    candidates = getCandidates()
    votes = getCandidatesVotes(candidates, q)
    total = list(zip(candidates, votes))
    total.sort(key=lambda tup: tup[1])
    total.reverse()

    return total

def buildPieChartData(q=Q()):
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
    return json_data

