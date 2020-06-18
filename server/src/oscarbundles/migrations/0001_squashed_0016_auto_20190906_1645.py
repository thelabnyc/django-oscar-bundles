from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    replaces = [
        ('oscarbundles', '0001_initial'),
        ('oscarbundles', '0002_auto_20160902_1106'),
        ('oscarbundles', '0003_auto_20180315_1137'),
        ('oscarbundles', '0004_auto_20180315_1349'),
        ('oscarbundles', '0005_bundleentry'),
        ('oscarbundles', '0006_auto_20180318_1907'),
        ('oscarbundles', '0007_auto_20180318_1919'),
        ('oscarbundles', '0008_auto_20180318_1933'),
        ('oscarbundles', '0009_auto_20180319_1116'),
        ('oscarbundles', '0010_auto_20180319_1116'),
        ('oscarbundles', '0011_auto_20180319_1121'),
        ('oscarbundles', '0012_auto_20180319_1613'),
        ('oscarbundles', '0013_bundlegroup_headline'),
        ('oscarbundles', '0014_auto_20190305_0420'),
        ('oscarbundles', '0015_auto_20190826_1326'),
        ('oscarbundles', '0016_auto_20190906_1645'),
    ]

    initial = True

    dependencies = [
        ('catalogue', '0008_auto_20160304_1652'),
        ('offer', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BundleGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bundle_type', models.CharField(choices=[('default', 'Default')], default='default', max_length=200, verbose_name='Bundle Type')),
                ('name', models.CharField(blank=True, default='', max_length=200, verbose_name='Name')),
                ('headline', models.TextField(blank=True, default='Forget Something?', help_text='CTA headline in cart display', verbose_name='Headline')),
                ('description', models.TextField(blank=True, default='', verbose_name='Description')),
                ('image', models.ImageField(blank=True, max_length=255, null=True, upload_to='images/products/%Y/%m/')),
                ('suggested_parents', models.ManyToManyField(blank=True, related_name='suggesting_bundle_groups', to='catalogue.Product', verbose_name='Suggested Products')),
                ('triggering_parents', models.ManyToManyField(related_name='triggering_bundle_groups', to='catalogue.Product', verbose_name='Triggering Products')),
            ],
            options={
                'verbose_name': 'Bundle Group',
                'verbose_name_plural': 'Bundle Groups',
            },
        ),
        migrations.CreateModel(
            name='ConcreteBundle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bundle_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='concrete_bundles', to='oscarbundles.BundleGroup')),
                ('suggested_products', models.ManyToManyField(help_text='Which product(s) should this bundle suggest when triggered?', related_name='suggesting_bundles', to='catalogue.Product', verbose_name='Suggested Products')),
                ('triggering_product', models.ForeignKey(help_text='Which product should trigger this bundle?', on_delete=django.db.models.deletion.CASCADE, related_name='triggering_concrete_bundles', to='catalogue.Product', verbose_name='Triggering Product')),
            ],
            options={
                'verbose_name': 'Concrete Bundle',
                'verbose_name_plural': 'Concrete Bundles',
                'unique_together': {('bundle_group', 'triggering_product')},
            },
        ),
        migrations.CreateModel(
            name='UserConfigurableBundle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1, help_text='How many products from the range should be suggested?', verbose_name='Quantity')),
                ('bundle_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_configurable_bundles', to='oscarbundles.BundleGroup')),
                ('suggested_range', models.ForeignKey(help_text='Which range(s) should this bundle suggest when triggered?', on_delete=django.db.models.deletion.CASCADE, related_name='suggesting_bundles', to='offer.Range', verbose_name='Suggested Ranges')),
                ('triggering_product', models.ForeignKey(help_text='Which product should trigger this bundle?', on_delete=django.db.models.deletion.CASCADE, related_name='triggering_user_configurable_bundles', to='catalogue.Product', verbose_name='Triggering Product')),
            ],
            options={
                'verbose_name': 'User Configurable Bundle',
                'verbose_name_plural': 'User Configurable Bundles',
                'unique_together': {('bundle_group', 'triggering_product', 'suggested_range')},
            },
        ),
    ]
