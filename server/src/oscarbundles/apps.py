from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class BundlesConfig(AppConfig):
    name = 'oscarbundles'
    label = 'oscarbundles'
    # Translators: Backend Library Name
    verbose_name = _('Oscar Bundles')
