from django import forms
from django.forms.models import ModelMultipleChoiceField
from django.utils.translation import ugettext_lazy as _
from oscar.core.loading import get_model, get_class

Category = get_model('catalogue', 'Category')
Product = get_model('catalogue', 'Product')
Bundle = get_model('oscarbundles', 'Bundle')
BundleGroup = get_model('oscarbundles', 'BundleGroup')

GroupedModelMultipleChoiceField = get_class('oscarbundles.dashboard.fields', 'GroupedModelMultipleChoiceField')


class BundleSearchForm(forms.Form):
    text = forms.CharField(
        max_length=255, required=False, label=_('Search'))
    title = forms.CharField(
        max_length=255, required=False, label=_('Product title'))
    group = forms.ModelChoiceField(
        label=_('Group'),
        help_text=_('Select a bundle group to filter the bundles below.'),
        queryset=BundleGroup.objects,
        required=False)
    category = forms.ModelChoiceField(
        label=_('Product Category'),
        help_text=_('Select a category to filter the bundles below.'),
        queryset=Category.objects,
        required=False)

    def clean(self):
        cleaned_data = super().clean()
        cleaned_data['text'] = cleaned_data['text'].strip()
        cleaned_data['title'] = cleaned_data['title'].strip()
        return cleaned_data


class BundleGroupSearchForm(forms.Form):
    text = forms.CharField(
        max_length=255, required=False, label=_('Search'))

    def clean(self):
        cleaned_data = super().clean()
        cleaned_data['text'] = cleaned_data['text'].strip()
        return cleaned_data


class CategoryFilterForm(forms.Form):
    category = forms.ModelChoiceField(
        label=_('Product Category'),
        help_text=_('Select a category to filter the products below.'),
        queryset=Category.objects,
        required=False)


class MetadataForm(forms.ModelForm):
    class Meta:
        model = Bundle
        fields = ('name', 'description', 'image', 'bundle_group')


class TriggeringProductsForm(forms.ModelForm):
    triggering_products = GroupedModelMultipleChoiceField(
        group_by='parent',
        label=_('Triggering Products'),
        help_text=_('What products should trigger this bundle?'),
        queryset=Product.objects)

    class Meta:
        model = Bundle
        fields = ('triggering_products', )


class SuggestedProductsForm(forms.ModelForm):
    suggested_products = GroupedModelMultipleChoiceField(
        group_by='parent',
        label=_('Suggested Products'),
        help_text=_('What products should be suggested by this bundle?'),
        queryset=Product.objects)

    class Meta:
        model = Bundle
        fields = ('suggested_products', )


class BundleGroupMetadataForm(forms.ModelForm):
    class Meta:
        model = BundleGroup
        fields = ('name', 'description', 'image')


class BundleGroupBundlesForm(forms.ModelForm):
    bundle_set = ModelMultipleChoiceField(queryset=Bundle.objects.all())

    class Meta:
        model = BundleGroup
        fields = ('bundle_set',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance:
            self.fields['bundle_set'].initial = self.instance.bundle_set.all()

    def save(self, commit=True, *args, **kwargs):
        obj = super().save(commit, *args, **kwargs)
        if commit:
            # Delete any not in new set
            for bundle in obj.bundle_set.all():
                if bundle not in self.cleaned_data['bundle_set']:
                    obj.bundle_set.remove(bundle)
            for bundle in self.cleaned_data['bundle_set']:
                obj.bundle_set.add(bundle)
        return obj
