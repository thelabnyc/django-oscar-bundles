from django.urls import re_path
from django.views.i18n import JavaScriptCatalog
from django.views.decorators.cache import cache_page
from django.views.generic.base import RedirectView
from django.utils.translation import gettext_lazy as _
from oscar.core.application import OscarConfig


def cache(fn):
    return cache_page(60 * 15)(fn)


class OscarBundlesAPIConfig(OscarConfig):
    label = "oscarbundles_api"
    name = "oscarbundles.api"
    verbose_name = _("Oscar Bundles API")

    namespace = "oscarbundles_api"

    def get_urls(self):
        from oscarbundles.api.views import (
            ProductConcreteBundleList,
            ProductUserConfigurableBundleList,
            ConcreteBundleList,
            ConcreteBundleDetail,
            ConcreteBundleProductChoicesList,
            UserConfigurableBundleList,
            UserConfigurableBundleDetail,
            UserConfigurableBundleRangeChoicesList,
            BundleGroupList,
            BundleGroupDetail,
        )

        urlpatterns = [
            # Cached views
            re_path(
                r"^products/(?P<pk>[0-9]+)/bundles/$",
                RedirectView.as_view(pattern_name="product-concretebundle-list"),
                name="product-bundle-list",
            ),
            re_path(
                r"^products/(?P<pk>[0-9]+)/concretebundles/$",
                ProductConcreteBundleList.as_view(),
                name="product-concretebundle-list",
            ),
            re_path(
                r"^products/(?P<pk>[0-9]+)/userconfigurablebundles/$",
                ProductUserConfigurableBundleList.as_view(),
                name="product-userconfigurablebundle-list",
            ),
            re_path(
                r"^bundles/i18n\.js$",
                cache(JavaScriptCatalog.as_view(packages=["oscarbundles"])),
                name="oscarbundles-i18n-js",
            ),
            # Uncached views
            re_path(
                r"^bundlegroups/$", BundleGroupList.as_view(), name="bundlegroup-list"
            ),
            re_path(
                r"^bundlegroups/(?P<pk>[0-9]+)/$",
                BundleGroupDetail.as_view(),
                name="bundlegroup-detail",
            ),
            re_path(
                r"^concretebundles/$",
                ConcreteBundleList.as_view(),
                name="concretebundle-list",
            ),
            re_path(
                r"^concretebundles/(?P<pk>[0-9]+)/$",
                ConcreteBundleDetail.as_view(),
                name="concretebundle-detail",
            ),
            re_path(
                r"^concretebundles/product-choices/$",
                ConcreteBundleProductChoicesList.as_view(),
                name="concretebundle-product-choice-list",
            ),
            re_path(
                r"^userconfigurablebundles/$",
                UserConfigurableBundleList.as_view(),
                name="userconfigurablebundle-list",
            ),
            re_path(
                r"^userconfigurablebundles/(?P<pk>[0-9]+)/$",
                UserConfigurableBundleDetail.as_view(),
                name="userconfigurablebundle-detail",
            ),
            re_path(
                r"^userconfigurablebundles/range-choices/$",
                UserConfigurableBundleRangeChoicesList.as_view(),
                name="userconfigurablebundle-range-choice-list",
            ),
        ]
        return self.post_process_urls(urlpatterns)
