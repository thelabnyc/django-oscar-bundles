from django.db import models
from django.utils.translation import ugettext_lazy as _
from oscar.core.loading import get_model

Product = get_model('catalogue', 'Product')


class Bundle(models.Model):
    name = models.CharField(_('Name'),
        max_length=200,
        blank=True,
        default='',
        help_text=_('Optional name for this bundle'))
    description = models.TextField(_('Description'),
        blank=True,
        default='',
        help_text=_('Optional description for this bundle'))
    triggering_products = models.ManyToManyField('catalogue.Product',
        related_name='triggering_bundles',
        verbose_name=_('Triggering Products'),
        help_text=_('Which product(s) should trigger this bundle?'))
    suggested_products = models.ManyToManyField('catalogue.Product',
        related_name='suggesting_bundles',
        verbose_name=_('Suggested Products'),
        help_text=_('Which product(s) should this bundle suggest when triggered?'))

    def __str__(self):
        return self.name
