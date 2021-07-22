from django.apps import apps
from django.conf import settings
from django.conf.urls import include, i18n
from django.urls import re_path
from django.contrib import admin
from django.views.static import serve

MEDIA_SETTINGS = {"document_root": settings.MEDIA_ROOT, "show_indexes": True}

urlpatterns = [
    re_path(r"^i18n/", include(i18n)),
    re_path(r"^admin/", admin.site.urls),
    re_path(r"^media/(?P<path>.*)$", serve, MEDIA_SETTINGS),
    # Oscar Bundles API URLs
    re_path(r"^api/", include(apps.get_app_config("oscarbundles_api").urls[0])),
    re_path(r"^api/", include("oscarapi.urls")),
    # Oscar Bundles Dashboard URLs
    re_path(
        r"^dashboard/", include(apps.get_app_config("oscarbundles_dashboard").urls[0])
    ),
    # Include stock Oscar
    re_path(r"^", include(apps.get_app_config("oscar").urls[0])),
]
