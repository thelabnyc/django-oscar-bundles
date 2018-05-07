# -*- coding: utf-8 -*-
# Generated by Django 1.9.12 on 2018-05-04 13:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('oscarbundles', '0012_auto_20180319_1613'),
    ]

    operations = [
        migrations.AddField(
            model_name='bundlegroup',
            name='headline',
            field=models.CharField(blank=True, default='Forget Something?', help_text='CTA headline in cart display', max_length=200),
        ),
    ]
