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
BundleGroup = get_model('oscarbundles', 'BundleGroup')

BundleSearchForm = get_class('oscarbundles.dashboard.forms', 'BundleSearchForm')
BundleGroupSearchForm = get_class('oscarbundles.dashboard.forms', 'BundleGroupSearchForm')
MetadataForm = get_class('oscarbundles.dashboard.forms', 'MetadataForm')
CategoryFilterForm = get_class('oscarbundles.dashboard.forms', 'CategoryFilterForm')
TriggeringProductsForm = get_class('oscarbundles.dashboard.forms', 'TriggeringProductsForm')
SuggestedProductsForm = get_class('oscarbundles.dashboard.forms', 'SuggestedProductsForm')
BundleGroupMetadataForm = get_class('oscarbundles.dashboard.forms', 'BundleGroupMetadataForm')
BundleGroupBundlesForm = get_class('oscarbundles.dashboard.forms', 'BundleGroupBundlesForm')


class BundleListView(ListView):
    form_class = BundleSearchForm
    ordering = ('-id', )
    paginate_by = 25
    template_name = 'oscarbundles/dashboard/bundle_list.html'

    def get_queryset(self):
        queryset = Bundle.objects.get_queryset()
        queryset = self.apply_search(queryset)
        return queryset

    def apply_search(self, queryset):
        self.form = self.form_class(self.request.GET)
        if not self.form.is_valid():
            return queryset
        data = self.form.cleaned_data

        text = data.get('text')
        if text:
            name = Q(name__icontains=text)
            descr = Q(description__icontains=text)
            group_name = Q(bundle_group__name__icontains=text)
            group_descr = Q(bundle_group__description__icontains=text)
            queryset = queryset.filter(name | descr | group_name | group_descr)

        title = data.get('title')
        if title:
            triggering = Q(triggering_products__title__icontains=title)
            suggested = Q(suggested_products__title__icontains=title)
            queryset = queryset.filter(triggering | suggested)

        group = data.get('group')
        if group:
            queryset = queryset.filter(bundle_group=group)

        category = data.get('category')
        if category:
            categories = Category.get_tree(category)
            triggering = Q(triggering_products__categories__in=categories)
            suggested = Q(suggested_products__categories__in=categories)
            queryset = queryset.filter(triggering | suggested)

        return queryset

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['form'] = self.form
        return ctx


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


class BundleGroupListView(ListView):
    form_class = BundleGroupSearchForm
    ordering = ('-id', )
    paginate_by = 25
    template_name = 'oscarbundles/dashboard/bundle_group/list.html'

    def get_queryset(self):
        queryset = BundleGroup.objects.get_queryset()
        queryset = self.apply_search(queryset)
        return queryset

    def apply_search(self, queryset):
        self.form = self.form_class(self.request.GET)
        if not self.form.is_valid():
            return queryset
        data = self.form.cleaned_data

        text = data.get('text')
        if text:
            name = Q(name__icontains=text)
            descr = Q(description__icontains=text)
            queryset = queryset.filter(name | descr)

        return queryset

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['form'] = self.form
        return ctx


class BundleGroupDetailView(DetailView):
    model = BundleGroup
    template_name = 'oscarbundles/dashboard/bundle_group/detail.html'


class CreateBundleGroupView(CreateView):
    model = BundleGroup
    form_class = BundleGroupMetadataForm
    template_name = 'oscarbundles/dashboard/bundle_group/create.html'

    def get_success_url(self):
        return reverse('dashboard-bundle-group-bundles', args=(self.object.pk, ))


class EditBundleGroupView(UpdateView):
    model = BundleGroup
    form_class = BundleGroupMetadataForm
    template_name = 'oscarbundles/dashboard/bundle_group/update.html'

    def get_success_url(self):
        return reverse('dashboard-bundle-group-detail', args=(self.object.pk, ))


class BundleGroupBundlesView(UpdateView):
    model = BundleGroup
    form_class = BundleGroupBundlesForm
    template_name = 'oscarbundles/dashboard/bundle_group/bundles.html'

    def get_success_url(self):
        return reverse('dashboard-bundle-group-detail', args=(self.object.pk, ))


class DeleteBundleGroupView(DeleteView):
    model = BundleGroup
    template_name = 'oscarbundles/dashboard/bundle_group/delete.html'
    success_url = reverse_lazy('dashboard-bundle-group-list')
