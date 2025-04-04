from collections.abc import Callable

from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import cache_page
from django.views.generic.base import RedirectView
from django.views.i18n import JavaScriptCatalog
from oscar.core.application import OscarConfig


def cache[T, **P](fn: Callable[P, T]) -> Callable[P, T]:
    return cache_page(60 * 15)(fn)


class OscarBundlesAPIConfig(OscarConfig):
    label = "oscarbundles_api"
    name = "oscarbundles.api"
    verbose_name = _("Oscar Bundles API")
    default = True

    namespace = "oscarbundles_api"

    def get_urls(self) -> list[URLPattern | URLResolver]:
        from oscarbundles.api.views import (
            BundleGroupDetail,
            BundleGroupList,
            BundleGroupTypeList,
            ConcreteBundleDetail,
            ConcreteBundleList,
            ConcreteBundleProductChoicesList,
            ProductConcreteBundleList,
            ProductUserConfigurableBundleList,
            UserConfigurableBundleDetail,
            UserConfigurableBundleList,
            UserConfigurableBundleRangeChoicesList,
        )

        urlpatterns = [
            # Cached views
            path(
                "products/<int:pk>/bundles/",
                RedirectView.as_view(pattern_name="product-concretebundle-list"),
                name="product-bundle-list",
            ),
            path(
                "products/<int:pk>/concretebundles/",
                ProductConcreteBundleList.as_view(),
                name="product-concretebundle-list",
            ),
            path(
                "products/<int:pk>/userconfigurablebundles/",
                ProductUserConfigurableBundleList.as_view(),
                name="product-userconfigurablebundle-list",
            ),
            path(
                "bundles/i18n.js",
                cache(JavaScriptCatalog.as_view(packages=["oscarbundles"])),
                name="oscarbundles-i18n-js",
            ),
            # Uncached views
            path(
                "bundlegrouptypes/",
                BundleGroupTypeList.as_view(),
                name="bundlegrouptype-list",
            ),
            path("bundlegroups/", BundleGroupList.as_view(), name="bundlegroup-list"),
            path(
                "bundlegroups/<int:pk>/",
                BundleGroupDetail.as_view(),
                name="bundlegroup-detail",
            ),
            path(
                "concretebundles/",
                ConcreteBundleList.as_view(),
                name="concretebundle-list",
            ),
            path(
                "concretebundles/<int:pk>/",
                ConcreteBundleDetail.as_view(),
                name="concretebundle-detail",
            ),
            path(
                "concretebundles/product-choices/",
                ConcreteBundleProductChoicesList.as_view(),
                name="concretebundle-product-choice-list",
            ),
            path(
                "userconfigurablebundles/",
                UserConfigurableBundleList.as_view(),
                name="userconfigurablebundle-list",
            ),
            path(
                "userconfigurablebundles/<int:pk>/",
                UserConfigurableBundleDetail.as_view(),
                name="userconfigurablebundle-detail",
            ),
            path(
                "userconfigurablebundles/range-choices/",
                UserConfigurableBundleRangeChoicesList.as_view(),
                name="userconfigurablebundle-range-choice-list",
            ),
        ]
        return self.post_process_urls(urlpatterns)  # type:ignore[no-any-return]
