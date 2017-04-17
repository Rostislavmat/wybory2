from .utility import *
# Create your views here.


def index():
    w = Kraj.objects.all()[0]
    return renderIndex(w)


def search(x):
    return renderSearch(x);

def input(token):
    return renderInput(token);

def renderIndex(region):
    title = 'Cały kraj'
    return renderHTML(region, title, True)


def wojewodztwo(wojewodztwo_slug):
    w = Wojewodztwo.objects.get(slug=wojewodztwo_slug)
    return renderWojewodztwo(w)


def renderWojewodztwo(region):
    title = 'Wojewodztwo {0}'.format(region.name)
    return renderHTML( region, title)


def powiat(wojewodztwo_slug, powiat_slug):
    w = Wojewodztwo.objects.get(slug=wojewodztwo_slug)
    p = Powiat.objects.get(slug=powiat_slug, wojewodztwo=w)
    return renderPowiat(r , p)


def renderPowiat( region):
    title = 'Powiat {0}'.format(region.name)
    return renderHTML( region, title)


def gmina(wojewodztwo_slug, powiat_slug, gmina_slug):
    w = Wojewodztwo.objects.get(slug=wojewodztwo_slug)
    p = Powiat.objects.get(slug=powiat_slug, wojewodztwo=w)
    g = Gmina.objects.get(powiat=p, slug=gmina_slug)
    return renderGmina(r , g)


def renderGmina( region):
    title = 'Gmina {0}'.format(region.name)
    return renderSimplifiedHTML(r , region, title)
