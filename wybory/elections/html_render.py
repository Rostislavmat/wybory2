from .utility import *
# Create your views here.


def index(request):
    kraj = Kraj.objects.all()[0]
    title = 'Cały kraj'
    return renderHTML(request,kraj, title, True)



def wojewodztwo(request,wojewodztwo_name):
    woj = Wojewodztwo.objects.get(name=wojewodztwo_name)
    title = 'Wojewodztwo {0}'.format(woj.name)
    return renderHTML( request, woj, title)


def okreg(request,okreg_name):
    okr = Okreg.objects.get(name=okreg_name)
    title = 'Okreg {0}'.format(okr.name)
    return renderHTML( request ,okr, title)


def gmina(request,gmina_name):
    gm = Gmina.objects.get(code=gmina_name)
    title = 'Gmina {0}'.format(gm.name)
    return renderSimplifiedHTML(request,gm, title)


