# Generated by Django 3.2.19 on 2023-05-05 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("oscarbundles", "0001_squashed_0016_auto_20190906_1645"),
    ]

    operations = [
        migrations.AddField(
            model_name="bundlegroup",
            name="is_active",
            field=models.BooleanField(default=True, verbose_name="is_active"),
        ),
    ]