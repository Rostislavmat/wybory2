# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-18 19:39
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('elections', '0016_auto_20170418_2138'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gmina',
            old_name='ballots',
            new_name='max_votes',
        ),
        migrations.RenameField(
            model_name='gmina',
            old_name='voters',
            new_name='valid_votes',
        ),
        migrations.RenameField(
            model_name='kraj',
            old_name='ballots',
            new_name='max_votes',
        ),
        migrations.RenameField(
            model_name='kraj',
            old_name='voters',
            new_name='valid_votes',
        ),
        migrations.RenameField(
            model_name='okreg',
            old_name='ballots',
            new_name='max_votes',
        ),
        migrations.RenameField(
            model_name='okreg',
            old_name='voters',
            new_name='valid_votes',
        ),
        migrations.RenameField(
            model_name='wojewodztwo',
            old_name='ballots',
            new_name='max_votes',
        ),
        migrations.RenameField(
            model_name='wojewodztwo',
            old_name='voters',
            new_name='valid_votes',
        ),
    ]