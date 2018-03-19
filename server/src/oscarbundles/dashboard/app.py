from django.conf.urls import url, include
from oscar.core.application import Application
from .views import BundleGroupSPAView


class DashboardBundleApplication(Application):
    default_permissions = ['is_staff', ]

    def get_urls(self):
        urlpatterns = [
            url(r'^bundle-groups/', include([
                url(r'^$', BundleGroupSPAView.as_view(), name='dashboard-bundle-group-list'),
            ])),
        ]
        return self.post_process_urls(urlpatterns)


application = DashboardBundleApplication()
