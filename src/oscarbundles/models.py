from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from oscar.core.loading import get_model

Product = get_model('catalogue', 'Product')


class BundleMetaMixin(models.Model):
    name = models.CharField(_('Name'),
        max_length=200,
        blank=True,
        default='',
        help_text=_('Optional name for this bundle'))
    description = models.TextField(_('Description'),
        blank=True,
        default='',
        help_text=_('Optional description for this bundle'))
    image = models.ImageField(
        upload_to=settings.OSCAR_IMAGE_FOLDER, max_length=255,
        blank=True, null=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class Bundle(BundleMetaMixin, models.Model):
    bundle_group = models.ForeignKey('BundleGroup',
        blank=True, null=True, help_text=_('Optional grouping for bundle'))
    triggering_products = models.ManyToManyField('catalogue.Product',
        related_name='triggering_bundles',
        verbose_name=_('Triggering Products'),
        help_text=_('Which product(s) should trigger this bundle?'))
    suggested_products = models.ManyToManyField('catalogue.Product',
        related_name='suggesting_bundles',
        verbose_name=_('Suggested Products'),
        help_text=_('Which product(s) should this bundle suggest when triggered?'))


class BundleGroup(BundleMetaMixin, models.Model):
    pass
