from django import forms

class SearchForm(forms.Form):
    class Meta:
        fields = ["title"]
        def clean(self):
            x = 1

class RegForm(forms.Form):
    class Meta:
        fields = ["name","password"]
        def clean(self):
            x = 1


