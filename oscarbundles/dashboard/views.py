from django.core.urlresolvers import reverse, reverse_lazy
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView
from oscar.core.loading import get_model, get_class

Category = get_model('catalogue', 'Category')
Product = get_model('catalogue', 'Product')
Bundle = get_model('oscarbundles', 'Bundle')

MetadataForm = get_class('oscarbundles.dashboard.forms', 'MetadataForm')
CategoryFilterForm = get_class('oscarbundles.dashboard.forms', 'CategoryFilterForm')
TriggeringProductsForm = get_class('oscarbundles.dashboard.forms', 'TriggeringProductsForm')
SuggestedProductsForm = get_class('oscarbundles.dashboard.forms', 'SuggestedProductsForm')


class BundleListView(ListView):
    model = Bundle
    ordering = ('-id', )
    paginate_by = 25
    template_name = 'oscarbundles/dashboard/bundle_list.html'


class BundleDetailView(DetailView):
    model = Bundle
    template_name = 'oscarbundles/dashboard/bundle_detail.html'


class CreateBundleView(CreateView):
    model = Bundle
    form_class = MetadataForm
    template_name = 'oscarbundles/dashboard/bundle_create.html'

    def get_success_url(self):
        return reverse('dashboard-bundle-triggering-products', args=(self.object.pk, ))


class EditBundleView(UpdateView):
    model = Bundle
    form_class = MetadataForm
    template_name = 'oscarbundles/dashboard/bundle_update.html'

    def get_success_url(self):
        return reverse('dashboard-bundle-detail', args=(self.object.pk, ))


class RelatedProductView(UpdateView):
    model = Bundle
    template_name = 'oscarbundles/dashboard/bundle_related_products.html'
    field_name = None
    title = None

    def get(self, request, *args, **kwargs):
        self._load_category_filter(request)
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self._load_category_filter(request)
        return super().post(request, *args, **kwargs)

    def get_form(self, *args, **kwargs):
        form = super().get_form(*args, **kwargs)

        qs = form.fields[self.field_name].queryset
        qs = qs.exclude(structure=Product.PARENT)

        if self.category_form.is_valid():
            category = self.category_form.cleaned_data['category']
            if category:
                cat_filter = Q(categories=category) | Q(parent__categories=category)
                existing_filter = Q(pk__in=[obj.pk for obj in getattr(self.object, self.field_name).all()])
                qs = qs.filter(cat_filter | existing_filter)

        form.fields[self.field_name].queryset = qs
        return form

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['category_form'] = self.category_form
        data['title'] = self.title
        data['field_name'] = self.field_name
        return data

    def _load_category_filter(self, request):
        self.category_form = CategoryFilterForm(request.GET)


class TriggeringProductView(RelatedProductView):
    form_class = TriggeringProductsForm
    field_name = 'triggering_products'
    title = _('Edit triggering products')

    def get_success_url(self):
        return reverse('dashboard-bundle-suggested-products', args=(self.object.pk, ))


class SuggestedProductView(RelatedProductView):
    form_class = SuggestedProductsForm
    field_name = 'suggested_products'
    title = _('Edit suggested products')

    def get_success_url(self):
        return reverse('dashboard-bundle-detail', args=(self.object.pk, ))


class DeleteBundleView(DeleteView):
    model = Bundle
    template_name = 'oscarbundles/dashboard/bundle_delete.html'
    success_url = reverse_lazy('dashboard-bundle-list')
