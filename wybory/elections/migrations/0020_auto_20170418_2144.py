# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-18 19:44
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0019_auto_20170418_2143'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gmina',
            old_name='max_votes',
            new_name='voters',
        ),
        migrations.RenameField(
            model_name='kraj',
            old_name='max_votes',
            new_name='voters',
        ),
        migrations.RenameField(
            model_name='okreg',
            old_name='max_votes',
            new_name='voters',
        ),
        migrations.RenameField(
            model_name='wojewodztwo',
            old_name='max_votes',
            new_name='voters',
        ),
    ]