from django.db import models
from django.db.models import *
from django.template.defaultfilters import slugify

from django.conf import settings


class Region(models.Model):
    name = models.CharField(max_length=200)
    max_votes = models.IntegerField(default=0)
    valid_votes = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        super(Region, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


class Kraj(Region):
    subunit_str = 'Województwo'

    def subunit(self):
        return Wojewodztwo

    def buildQ(self):
        return Q()
    
    def path(self):
        format_str = '/'
        return format_str

    def css_dir(self):
        return './'


class Wojewodztwo(Region):
    subunit_str = 'Okręg'

    def subunit(self):
        return Okreg

    def buildQ(self):
        return Q(wojewodztwo=self)
    
    def path(self):
        format_str = 'woje/{0}/'
        return format_str.format(self.name)
    
    def css_dir(self):
        return './../'


class Okreg(Region):
    wojewodztwo = models.ForeignKey(Wojewodztwo)

    subunit_str = 'Gmina'

    def subunit(self):
        return Gmina

    def buildQ(self):
        return Q(okreg=self)
    
    def path(self):
        format_str = 'okreg/{0}/'
        return format_str.format(self.name)

    def css_dir(self):
        return './../../'


class Gmina(Region):
    okreg = models.ForeignKey(Okreg)
    code = models.IntegerField()

    
    def path(self):
        format_str = 'gmina/{0}/'
        return format_str.format(self.code)

    def buildQ(self):
        return Q(gmina=self)
    def search(start) :
        return Q(name__startswith=start)
    def __str__(self):
        return self.name


    def css_dir(self):
        return './../../../'


class Candidate(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Vote(models.Model):
    wojewodztwo = models.ForeignKey(Wojewodztwo)
    gmina = models.ForeignKey(Gmina)
    okreg = models.ForeignKey(Okreg)
    candidate = models.ForeignKey(Candidate)
    votes = models.IntegerField()
    def getGmina(self):
        return gmina.code
    def __str__(self):
        return 'In {0}, {1}, {2}, {3} people voted for {4}'.format(self.wojewodztwo,
                                                                   self.gmina,
                                                                   self.okreg,
                                                                   self.votes,
                                                                   self.candidate)
