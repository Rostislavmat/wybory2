from django import forms

class PostForm(forms.Form):
    class Meta:
        fields = ["title"]
        def clean(self):
            x = 1