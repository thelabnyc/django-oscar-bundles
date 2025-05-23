# Generated by Django 1.11.10 on 2018-03-18 23:07

from django.db import migrations


def migrate_to_new_bundles(apps, schema_editor):
    Bundle = apps.get_model("oscarbundles", "Bundle")
    BundleEntry = apps.get_model("oscarbundles", "BundleEntry")
    BundleGroup = apps.get_model("oscarbundles", "BundleGroup")
    for bundle in Bundle.objects.all():
        if bundle.bundle_group:
            bundle_group = bundle.bundle_group
        else:
            bundle_group = BundleGroup.objects.create(
                name=bundle.name, description=bundle.description, image=bundle.image
            )
        for triggering_product in bundle.triggering_products.all():
            bundle_entry = BundleEntry.objects.create(
                bundle_group=bundle_group, triggering_product=triggering_product
            )
            bundle_entry.suggested_products.set(bundle.suggested_products.all())
            bundle_entry.save()


def migrate_to_old_bundles(apps, schema_editor):
    Bundle = apps.get_model("oscarbundles", "Bundle")
    BundleEntry = apps.get_model("oscarbundles", "BundleEntry")
    for bundle_entry in BundleEntry.objects.all():
        bundle = Bundle.objects.create(bundle_group=bundle_entry.bundle_group)
        bundle.triggering_products.add(bundle_entry.triggering_product)
        bundle.suggested_products.set(bundle.suggested_products.all())
        bundle.save()


class Migration(migrations.Migration):
    dependencies = [
        ("oscarbundles", "0005_bundleentry"),
    ]

    operations = [
        migrations.RunPython(migrate_to_new_bundles, migrate_to_old_bundles),
    ]
