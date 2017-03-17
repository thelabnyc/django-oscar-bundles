from django.conf.urls import url, include
from oscar.core.application import Application
from oscar.core.loading import get_class

BundleListView = get_class('oscarbundles.dashboard.views', 'BundleListView')
BundleDetailView = get_class('oscarbundles.dashboard.views', 'BundleDetailView')
CreateBundleView = get_class('oscarbundles.dashboard.views', 'CreateBundleView')
EditBundleView = get_class('oscarbundles.dashboard.views', 'EditBundleView')
TriggeringProductView = get_class('oscarbundles.dashboard.views', 'TriggeringProductView')
SuggestedProductView = get_class('oscarbundles.dashboard.views', 'SuggestedProductView')
DeleteBundleView = get_class('oscarbundles.dashboard.views', 'DeleteBundleView')

BundleGroupListView = get_class('oscarbundles.dashboard.views', 'BundleGroupListView')
BundleGroupDetailView = get_class('oscarbundles.dashboard.views', 'BundleGroupDetailView')
CreateBundleGroupView = get_class('oscarbundles.dashboard.views', 'CreateBundleGroupView')
EditBundleGroupView = get_class('oscarbundles.dashboard.views', 'EditBundleGroupView')
BundleGroupBundlesView = get_class('oscarbundles.dashboard.views', 'BundleGroupBundlesView')
DeleteBundleGroupView = get_class('oscarbundles.dashboard.views', 'DeleteBundleGroupView')


class DashboardBundleApplication(Application):
    default_permissions = ['is_staff', ]

    def get_urls(self):
        urlpatterns = [
            url(r'^bundles/', include([
                url(r'^$', BundleListView.as_view(), name='dashboard-bundle-list'),
                url(r'^new/$', CreateBundleView.as_view(), name='dashboard-bundle-create'),
                url(r'^(?P<pk>\d+)/$', BundleDetailView.as_view(), name='dashboard-bundle-detail'),
                url(r'^(?P<pk>\d+)/edit/$', EditBundleView.as_view(), name='dashboard-bundle-edit'),
                url(r'^(?P<pk>\d+)/edit/triggering-products/$', TriggeringProductView.as_view(), name='dashboard-bundle-triggering-products'),
                url(r'^(?P<pk>\d+)/edit/suggested-products/$', SuggestedProductView.as_view(), name='dashboard-bundle-suggested-products'),
                url(r'^(?P<pk>\d+)/delete/$', DeleteBundleView.as_view(), name='dashboard-bundle-delete'),
            ])),
            url(r'^bundle_groups/', include([
                url(r'^$', BundleGroupListView.as_view(), name='dashboard-bundle-group-list'),
                url(r'^new/$', CreateBundleGroupView.as_view(), name='dashboard-bundle-group-create'),
                url(r'^(?P<pk>\d+)/$', BundleGroupDetailView.as_view(), name='dashboard-bundle-group-detail'),
                url(r'^(?P<pk>\d+)/edit/$', EditBundleGroupView.as_view(), name='dashboard-bundle-group-edit'),
                url(r'^(?P<pk>\d+)/edit/bundles/$', BundleGroupBundlesView.as_view(), name='dashboard-bundle-group-bundles'),
                url(r'^(?P<pk>\d+)/delete/$', DeleteBundleGroupView.as_view(), name='dashboard-bundle-group-delete'),
            ])),
        ]
        return self.post_process_urls(urlpatterns)


application = DashboardBundleApplication()
