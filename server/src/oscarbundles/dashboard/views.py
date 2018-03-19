from django.views.generic import TemplateView
from oscar.core.loading import get_model

Category = get_model('catalogue', 'Category')
Product = get_model('catalogue', 'Product')


class BundleGroupSPAView(TemplateView):
    template_name = 'oscarbundles/dashboard/bundlegroup/bundlegroup-spa.html'
