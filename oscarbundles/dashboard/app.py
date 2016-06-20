from django.conf.urls import url
from oscar.core.application import Application
from oscar.core.loading import get_class

BundleListView = get_class('oscarbundles.dashboard.views', 'BundleListView')
BundleDetailView = get_class('oscarbundles.dashboard.views', 'BundleDetailView')
CreateBundleView = get_class('oscarbundles.dashboard.views', 'CreateBundleView')
EditBundleView = get_class('oscarbundles.dashboard.views', 'EditBundleView')
TriggeringProductView = get_class('oscarbundles.dashboard.views', 'TriggeringProductView')
SuggestedProductView = get_class('oscarbundles.dashboard.views', 'SuggestedProductView')
DeleteBundleView = get_class('oscarbundles.dashboard.views', 'DeleteBundleView')


class DashboardBundleApplication(Application):
    default_permissions = ['is_staff', ]

    def get_urls(self):
        urlpatterns = [
            url(r'^bundles/$', BundleListView.as_view(), name='dashboard-bundle-list'),
            url(r'^bundles/new/$', CreateBundleView.as_view(), name='dashboard-bundle-create'),
            url(r'^bundles/(?P<pk>\d+)/$', BundleDetailView.as_view(), name='dashboard-bundle-detail'),
            url(r'^bundles/(?P<pk>\d+)/edit/$', EditBundleView.as_view(), name='dashboard-bundle-edit'),
            url(r'^bundles/(?P<pk>\d+)/edit/triggering-products/$', TriggeringProductView.as_view(), name='dashboard-bundle-triggering-products'),
            url(r'^bundles/(?P<pk>\d+)/edit/suggested-products/$', SuggestedProductView.as_view(), name='dashboard-bundle-suggested-products'),
            url(r'^bundles/(?P<pk>\d+)/delete/$', DeleteBundleView.as_view(), name='dashboard-bundle-delete'),
        ]
        return self.post_process_urls(urlpatterns)


application = DashboardBundleApplication()
