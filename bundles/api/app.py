from django.conf.urls import url
from oscar.core.application import Application
from .views import (
    BundleList,
    BundleDetail,
    ProductBundleList,
)


class DashboardBundleApplication(Application):
    def get_urls(self):
        urlpatterns = [
            url(r'^bundles/$', BundleList.as_view(), name='bundle-list'),
            url(r'^bundles/(?P<pk>[0-9]+)/$', BundleDetail.as_view(), name='bundle-detail'),

            url(r'^products/(?P<pk>[0-9]+)/bundles/$', ProductBundleList.as_view(), name='product-bundle-list'),
        ]
        return self.post_process_urls(urlpatterns)


application = DashboardBundleApplication()
