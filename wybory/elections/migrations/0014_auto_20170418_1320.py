# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-18 11:20
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0013_auto_20170418_1258'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gmina',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='kraj',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='okreg',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='wojewodztwo',
            name='slug',
        ),
    ]
