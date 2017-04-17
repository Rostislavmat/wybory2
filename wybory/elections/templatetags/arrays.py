from django import template

register = template.Library()


@register.filter
def ind(l, i):
    try:
        return l[i]
    except:
        return None