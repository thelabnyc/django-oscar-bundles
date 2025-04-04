# Generated by Django 1.11.10 on 2018-03-18 23:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("catalogue", "0008_auto_20160304_1652"),
        ("oscarbundles", "0004_auto_20180315_1349"),
    ]

    operations = [
        migrations.CreateModel(
            name="BundleEntry",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "bundle_group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="oscarbundles.BundleGroup",
                    ),
                ),
                (
                    "suggested_products",
                    models.ManyToManyField(
                        help_text="Which product(s) should this bundle suggest when triggered?",
                        related_name="suggesting_bundle_entries",
                        to="catalogue.Product",
                        verbose_name="Suggested Products",
                    ),
                ),
                (
                    "triggering_product",
                    models.ForeignKey(
                        help_text="Which product should trigger this bundle?",
                        related_name="triggering_bundle_entries",
                        to="catalogue.Product",
                        verbose_name="Triggering Product",
                        on_delete=django.db.models.deletion.CASCADE,
                    ),
                ),
            ],
        ),
    ]
