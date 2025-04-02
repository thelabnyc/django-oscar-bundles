# Generated by Django 1.11.18 on 2019-03-05 09:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("oscarbundles", "0013_bundlegroup_headline"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bundlegroup",
            name="bundle_type",
            field=models.CharField(
                choices=[
                    ("default", "Default"),
                    ("upgrade-product", "Upgrade Products"),
                    (
                        "in-configurator-add-on-products",
                        "In-Configurator Add-On Products",
                    ),
                    (
                        "post-configurator-add-on-products",
                        "Post-Configurator Add-On Products",
                    ),
                    ("in-basket-add-on-products", "In-Basket Add-On Products"),
                    ("pdp-buy-together", 'PDP "Buy Together" Section'),
                ],
                default="default",
                max_length=200,
                verbose_name="Bundle Type",
            ),
        ),
        migrations.AlterField(
            model_name="bundlegroup",
            name="headline",
            field=models.TextField(
                blank=True,
                default="Forget Something?",
                help_text="CTA headline in cart display",
                verbose_name="Headline",
            ),
        ),
    ]
