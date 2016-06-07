from django.core.urlresolvers import reverse, reverse_lazy
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.generic.list import ListView
from oscar.core.loading import get_model
from .. import models
from . import forms

Category = get_model('catalogue', 'Category')
Product = get_model('catalogue', 'Product')


class BundleListView(ListView):
    model = models.Bundle
    ordering = ('-id', )
    paginate_by = 25
    template_name = 'bundles/dashboard/bundle_list.html'


class BundleDetailView(DetailView):
    model = models.Bundle
    template_name = 'bundles/dashboard/bundle_detail.html'


class CreateBundleView(CreateView):
    model = models.Bundle
    form_class = forms.MetadataForm
    template_name = 'bundles/dashboard/bundle_create.html'

    def get_success_url(self):
        return reverse('dashboard-bundle-triggering-products', args=(self.object.pk, ))


class EditBundleView(UpdateView):
    model = models.Bundle
    form_class = forms.MetadataForm
    template_name = 'bundles/dashboard/bundle_update.html'

    def get_success_url(self):
        return reverse('dashboard-bundle-detail', args=(self.object.pk, ))


class RelatedProductView(UpdateView):
    model = models.Bundle
    template_name = 'bundles/dashboard/bundle_related_products.html'
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
        self.category_form = forms.CategoryFilterForm(request.GET)


class TriggeringProductView(RelatedProductView):
    form_class = forms.TriggeringProductsForm
    field_name = 'triggering_products'
    title = _('Edit triggering products')

    def get_success_url(self):
        return reverse('dashboard-bundle-suggested-products', args=(self.object.pk, ))


class SuggestedProductView(RelatedProductView):
    form_class = forms.SuggestedProductsForm
    field_name = 'suggested_products'
    title = _('Edit suggested products')

    def get_success_url(self):
        return reverse('dashboard-bundle-detail', args=(self.object.pk, ))


class DeleteBundleView(DeleteView):
    model = models.Bundle
    template_name = 'bundles/dashboard/bundle_delete.html'
    success_url = reverse_lazy('dashboard-bundle-list')
