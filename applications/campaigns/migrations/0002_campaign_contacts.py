# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-05 17:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('campaigns', '0001_initial'),
        ('contacts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='contacts',
            field=models.ManyToManyField(through='contacts.ContactsList', to='contacts.Contact'),
        ),
    ]
