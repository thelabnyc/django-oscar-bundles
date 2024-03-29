# Generated by Django 2.1.11 on 2019-08-26 13:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("catalogue", "0008_auto_20160304_1652"),
        ("offer", "0001_initial"),
        ("oscarbundles", "0014_auto_20190305_0420"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="bundlegroup",
            options={
                "verbose_name": "Bundle Group",
                "verbose_name_plural": "Bundle Groups",
            },
        ),
        migrations.AlterField(
            model_name="bundlegroup",
            name="bundle_type",
            field=models.CharField(
                choices=[("default", "Default")],
                default="default",
                max_length=200,
                verbose_name="Bundle Type",
            ),
        ),
        migrations.RenameModel("Bundle", "ConcreteBundle"),
        migrations.AlterModelOptions(
            name="concretebundle",
            options={
                "verbose_name": "Concrete Bundle",
                "verbose_name_plural": "Concrete Bundles",
            },
        ),
        migrations.AlterField(
            model_name="concretebundle",
            name="bundle_group",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="concrete_bundles",
                to="oscarbundles.BundleGroup",
            ),
        ),
        migrations.CreateModel(
            name="UserConfigurableBundle",
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
                    "quantity",
                    models.PositiveIntegerField(
                        default=1,
                        help_text="How many products from the range should be suggested?",
                        verbose_name="Quantity",
                    ),
                ),
            ],
            options={
                "verbose_name": "User Configurable Bundle",
                "verbose_name_plural": "User Configurable Bundles",
            },
        ),
        migrations.AddField(
            model_name="userconfigurablebundle",
            name="bundle_group",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user_configurable_bundles",
                to="oscarbundles.BundleGroup",
            ),
        ),
        migrations.AddField(
            model_name="userconfigurablebundle",
            name="suggested_range",
            field=models.ForeignKey(
                help_text="Which range(s) should this bundle suggest when triggered?",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="suggesting_bundles",
                to="offer.Range",
                verbose_name="Suggested Ranges",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="userconfigurablebundle",
            unique_together={("bundle_group", "suggested_range")},
        ),
        migrations.AddField(
            model_name="userconfigurablebundle",
            name="triggering_product",
            field=models.ForeignKey(
                help_text="Which product should trigger this bundle?",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="triggering_user_configurable_bundles",
                to="catalogue.Product",
                verbose_name="Triggering Product",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="concretebundle",
            name="triggering_product",
            field=models.ForeignKey(
                help_text="Which product should trigger this bundle?",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="triggering_concrete_bundles",
                to="catalogue.Product",
                verbose_name="Triggering Product",
            ),
        ),
    ]
