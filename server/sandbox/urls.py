from django.conf import settings
from django.conf.urls import include, url, i18n
from django.contrib import admin
from django.views.static import serve
from oscar.app import application as oscar
from oscarapi.app import application as oscarapi
from oscarbundles.api.app import application as oscarbundlesapi
from oscarbundles.dashboard.app import application as oscarbundlesdashboard

MEDIA_SETTINGS = {
    'document_root': settings.MEDIA_ROOT,
    'show_indexes': True
}

urlpatterns = [
    url(r'^i18n/', include(i18n)),
    url(r'^admin/', admin.site.urls),
    url(r'^media/(?P<path>.*)$', serve, MEDIA_SETTINGS),

    url(r'^api/', oscarbundlesapi.urls),
    url(r'^api/', oscarapi.urls),

    url(r'^dashboard/', oscarbundlesdashboard.urls),

    # Include stock Oscar
    url(r'', oscar.urls),
]
