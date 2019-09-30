from django.conf.urls import url
from django.utils.translation import gettext_lazy as _
from oscar.core.application import OscarDashboardConfig


class OscarBundlesDashboardConfig(OscarDashboardConfig):
    label = 'oscarbundles_dashboard'
    name = 'oscarbundles.dashboard'
    verbose_name = _('Oscar Bundles Dashboard')

    namespace = 'oscarbundles_dashboard'
    default_permissions = ['is_staff', ]

    def get_urls(self):
        from .views import BundleGroupSPAView
        urlpatterns = [
            url(r'^bundle-groups/$', BundleGroupSPAView.as_view(), name='dashboard-bundle-group-list'),
        ]
        return self.post_process_urls(urlpatterns)
