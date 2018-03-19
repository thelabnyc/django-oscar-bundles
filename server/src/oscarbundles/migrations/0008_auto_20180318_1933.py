# -*- coding: utf-8 -*-
# Generated by Django 1.11.10 on 2018-03-18 23:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('oscarbundles', '0007_auto_20180318_1919'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bundle',
            name='bundle_group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bundles', to='oscarbundles.BundleGroup'),
        ),
        migrations.AlterField(
            model_name='bundle',
            name='suggested_products',
            field=models.ManyToManyField(help_text='Which product(s) should this bundle suggest when triggered?', related_name='suggesting_bundles', to='catalogue.Product', verbose_name='Suggested Products'),
        ),
        migrations.AlterField(
            model_name='bundle',
            name='triggering_product',
            field=models.ForeignKey(help_text='Which product should trigger this bundle?', on_delete=django.db.models.deletion.CASCADE, related_name='triggering_bundles', to='catalogue.Product', verbose_name='Triggering Product'),
        ),
    ]
