from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver
from django.utils.translation import gettext_lazy as _
from oscar.core.application import OscarDashboardConfig


class OscarBundlesDashboardConfig(OscarDashboardConfig):
    label = "oscarbundles_dashboard"
    name = "oscarbundles.dashboard"
    verbose_name = _("Oscar Bundles Dashboard")
    default = True

    namespace = "oscarbundles_dashboard"
    default_permissions = [  # type:ignore[assignment]
        "is_staff",
    ]

    def get_urls(self) -> list[URLPattern | URLResolver]:
        from .views import BundleGroupSPAView

        urlpatterns = [
            path(
                "bundle-groups/",
                BundleGroupSPAView.as_view(),
                name="dashboard-bundle-group-list",
            ),
        ]
        return self.post_process_urls(urlpatterns)  # type:ignore[no-any-return]
