# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-07 19:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0006_auto_20171206_2318'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaignrecord',
            name='was_sent',
            field=models.BooleanField(default=False),
        ),
    ]
