from django.apps import apps
from django.conf import settings
from django.conf.urls import include, i18n
from django.urls import path
from django.contrib import admin
from django.views.static import serve

MEDIA_SETTINGS = {"document_root": settings.MEDIA_ROOT, "show_indexes": True}

urlpatterns = [
    path("i18n/", include(i18n)),
    path("admin/", admin.site.urls),
    path("media/<path:path>", serve, MEDIA_SETTINGS),
    # Oscar Bundles API URLs
    path("api/", include(apps.get_app_config("oscarbundles_api").urls[0])),
    path("api/", include("oscarapi.urls")),
    # Oscar Bundles Dashboard URLs
    path("dashboard/", include(apps.get_app_config("oscarbundles_dashboard").urls[0])),
    # Include stock Oscar
    path("", include(apps.get_app_config("oscar").urls[0])),
]
