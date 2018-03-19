from django.conf.urls import url
from django.views.decorators.cache import cache_page
from oscar.core.application import Application
from oscarbundles.api.views import (
    ProductBundleList,

    BundleList,
    BundleDetail,

    BundleGroupList,
    BundleGroupDetail,

    BundleProductChoicesList,
)


def cache(fn):
    return cache_page(60 * 15)(fn)


class DashboardBundleApplication(Application):
    def get_urls(self):
        urlpatterns = [
            # Cached views
            url(r'^products/(?P<pk>[0-9]+)/bundles/$',
                cache(ProductBundleList.as_view()),
                name='product-bundle-list'),

            # Uncached views
            url(r'^bundles/$',
                BundleList.as_view(),
                name='bundle-list'),
            url(r'^bundles/(?P<pk>[0-9]+)/$',
                BundleDetail.as_view(),
                name='bundle-detail'),

            url(r'^bundles/product-choices/$',
                BundleProductChoicesList.as_view(),
                name='bundle-product-choice-list'),

            url(r'^bundlegroups/$',
                BundleGroupList.as_view(),
                name='bundlegroup-list'),
            url(r'^bundlegroups/(?P<pk>[0-9]+)/$',
                BundleGroupDetail.as_view(),
                name='bundlegroup-detail'),
        ]
        return self.post_process_urls(urlpatterns)


application = DashboardBundleApplication()
