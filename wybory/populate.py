from django.db import transaction

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wybory.settings")
import django
django.setup()

from elections.models import *
import parse

def clean():
    Kraj.objects.all().delete()
    Vote.objects.all().delete()
    Gmina.objects.all().delete()
    Okreg.objects.all().delete()
    Wojewodztwo.objects.all().delete()
    Candidate.objects.all().delete()

def constructVote(wojewodztwo, okreg, gmina, candidate, votes):
    vote = Vote()
    vote.wojewodztwo = wojewodztwo
    vote.gmina = gmina
    vote.okreg = okreg
    vote.candidate = candidate
    vote.votes = votes 
    return vote

def populate():
    cols, rows = parse.read()

    with transaction.atomic():

        all_votes = []
        for row in rows:
            kraj, _ = Kraj.objects.get_or_create(name = 'Polska')
            wojewodztwo, _ = Wojewodztwo.objects.get_or_create(name = row[0])
            okreg, _ = Okreg.objects.get_or_create(name = row[1], wojewodztwo = wojewodztwo)
            gmina, _ = Gmina.objects.get_or_create(name = row[3], code = row[2], okreg = okreg)

            for i in range(11, 23):
                candidate, _ = Candidate.objects.get_or_create(name = cols[i])
                vote = constructVote(wojewodztwo, okreg, gmina, candidate, row[i])
                all_votes.append(vote)

            max_votes = int(row[6])
            valid_votes = int(row[7])

            gmina.max_votes += max_votes
            gmina.valid_votes += valid_votes

            okreg.max_votes += max_votes
            okreg.valid_votes += valid_votes

            wojewodztwo.max_votes += max_votes
            wojewodztwo.valid_votes += valid_votes

            kraj.max_votes += max_votes
            kraj.valid_votes += valid_votes

            gmina.save()
            okreg.save()
            wojewodztwo.save()
            kraj.save()

            print(len(all_votes))

        Vote.objects.bulk_create(all_votes)

    print(Vote.objects.all())

clean()
populate()
