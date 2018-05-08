from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from oscar.core.loading import get_model

Product = get_model('catalogue', 'Product')


class BundleGroup(models.Model):
    GROUP_TYPE_OPTIONS = getattr(settings, 'BUNDLE_GROUP_TYPES', (
        ('default', 'Default'),
    ))

    bundle_type = models.CharField(_('Bundle Type'),
        max_length=200,
        default=GROUP_TYPE_OPTIONS[0][0],
        choices=GROUP_TYPE_OPTIONS)

    name = models.CharField(_('Name'),
        max_length=200,
        blank=True,
        default='')
    headline = models.CharField(
        max_length=200,
        blank=True,
        default='Forget Something?',
        help_text='CTA headline in cart display')
    description = models.TextField(_('Description'),
        blank=True,
        default='')
    image = models.ImageField(
        upload_to=settings.OSCAR_IMAGE_FOLDER,
        max_length=255,
        blank=True,
        null=True)

    triggering_parents = models.ManyToManyField('catalogue.Product',
        related_name='triggering_bundle_groups',
        verbose_name=_('Triggering Products'))
    suggested_parents = models.ManyToManyField('catalogue.Product',
        related_name='suggesting_bundle_groups',
        verbose_name=_('Suggested Products'))


class Bundle(models.Model):
    bundle_group = models.ForeignKey(BundleGroup,
        on_delete=models.CASCADE,
        related_name='bundles')

    triggering_product = models.ForeignKey('catalogue.Product',
        on_delete=models.CASCADE,
        related_name='triggering_bundles',
        verbose_name=_('Triggering Product'),
        help_text=_('Which product should trigger this bundle?'))
    suggested_products = models.ManyToManyField('catalogue.Product',
        related_name='suggesting_bundles',
        verbose_name=_('Suggested Products'),
        help_text=_('Which product(s) should this bundle suggest when triggered?'))

    class Meta:
        unique_together = (
            ('bundle_group', 'triggering_product'),
        )
