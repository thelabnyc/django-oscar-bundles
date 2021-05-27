from django.apps import apps
from django.conf import settings
from django.conf.urls import include, url, i18n
from django.contrib import admin
from django.views.static import serve

MEDIA_SETTINGS = {"document_root": settings.MEDIA_ROOT, "show_indexes": True}

urlpatterns = [
    url(r"^i18n/", include(i18n)),
    url(r"^admin/", admin.site.urls),
    url(r"^media/(?P<path>.*)$", serve, MEDIA_SETTINGS),
    # Oscar Bundles API URLs
    url(r"^api/", include(apps.get_app_config("oscarbundles_api").urls[0])),
    url(r"^api/", include("oscarapi.urls")),
    # Oscar Bundles Dashboard URLs
    url(r"^dashboard/", include(apps.get_app_config("oscarbundles_dashboard").urls[0])),
    # Include stock Oscar
    url(r"^", include(apps.get_app_config("oscar").urls[0])),
]
