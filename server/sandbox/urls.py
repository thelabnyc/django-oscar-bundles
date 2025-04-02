from django.apps import apps
from django.conf import settings
from django.conf.urls import i18n
from django.contrib import admin
from django.urls import include, path
from django.views.static import serve

MEDIA_SETTINGS = {"document_root": settings.MEDIA_ROOT, "show_indexes": True}

oscar = apps.get_app_config("oscar")
bundles_api = apps.get_app_config("oscarbundles_api")
bundles_dashboard = apps.get_app_config("oscarbundles_dashboard")

urlpatterns = [
    path("i18n/", include(i18n)),
    path("admin/", admin.site.urls),
    path("media/<path:path>", serve, MEDIA_SETTINGS),
    # Oscar Bundles API URLs
    path(
        "api/",
        include(bundles_api.urls[0]),  # type:ignore[attr-defined]
    ),
    path("api/", include("oscarapi.urls")),
    # Oscar Bundles Dashboard URLs
    path(
        "dashboard/",
        include(bundles_dashboard.urls[0]),  # type:ignore[attr-defined]
    ),
    # Include stock Oscar
    path(
        "",
        include(oscar.urls[0]),  # type:ignore[attr-defined]
    ),
]
