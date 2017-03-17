from django.conf.urls import url
from django.views.decorators.cache import cache_page
from oscar.core.application import Application
from oscar.core.loading import get_class

BundleList = get_class('oscarbundles.api.views', 'BundleList')
BundleDetail = get_class('oscarbundles.api.views', 'BundleDetail')
BundleGroupDetail = get_class('oscarbundles.api.views', 'BundleGroupDetail')
ProductBundleList = get_class('oscarbundles.api.views', 'ProductBundleList')


def cache(fn):
    return cache_page(60 * 15)(fn)


class DashboardBundleApplication(Application):
    def get_urls(self):
        urlpatterns = [
            url(r'^bundles/$',
                cache(BundleList.as_view()),
                name='bundle-list'),
            url(r'^bundles/(?P<pk>[0-9]+)/$',
                cache(BundleDetail.as_view()),
                name='bundle-detail'),
            url(r'^bundle_groups/(?P<pk>[0-9]+)/$',
                cache(BundleGroupDetail.as_view()),
                name='bundlegroup-detail'),

            url(r'^products/(?P<pk>[0-9]+)/bundles/$',
                cache(ProductBundleList.as_view()),
                name='product-bundle-list'),
        ]
        return self.post_process_urls(urlpatterns)


application = DashboardBundleApplication()
