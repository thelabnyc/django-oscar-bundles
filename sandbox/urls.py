from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from oscar.app import application as oscar_app
from oscarapi.app import application as oscar_api_app
from bundles.api.app import application as bundles_api_app
from bundles.dashboard.app import application as bundles_dashboard_app


urlpatterns = patterns('',
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),

    url(r'^api/', include(bundles_api_app.urls)),
    url(r'^api/', include(oscar_api_app.urls)),

    url(r'^dashboard/', include(bundles_dashboard_app.urls)),

    # Include stock Oscar
    url(r'', include(oscar_app.urls)),
)
