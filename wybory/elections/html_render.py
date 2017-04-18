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


def wojewodztwo(wojewodztwo_name):
    w = Wojewodztwo.objects.get(name=wojewodztwo_name)
    return renderWojewodztwo(w)


def renderWojewodztwo(region):
    title = 'Wojewodztwo {0}'.format(region.name)
    return renderHTML( region, title)


def okreg(okreg_name):
    p = Okreg.objects.get(name=okreg_name)
    return renderOkreg(p)


def renderOkreg( region):
    title = 'Okreg {0}'.format(region.name)
    return renderHTML( region, title)


def gmina(gmina_name):
    g = Gmina.objects.get(code=gmina_name)
    return renderGmina(g)


def renderGmina( region):
    title = 'Gmina {0}'.format(region.name)
    return renderSimplifiedHTML(region, title)
