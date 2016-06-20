from django import forms
from django.utils.translation import ugettext_lazy as _
from oscar.core.loading import get_model, get_class

Category = get_model('catalogue', 'Category')
Product = get_model('catalogue', 'Product')
Bundle = get_model('oscarbundles', 'Bundle')

GroupedModelMultipleChoiceField = get_class('oscarbundles.dashboard.fields', 'GroupedModelMultipleChoiceField')


class CategoryFilterForm(forms.Form):
    category = forms.ModelChoiceField(
        label=_('Product Category'),
        help_text=_('Select a category to filter the products below.'),
        queryset=Category.objects,
        required=False)


class MetadataForm(forms.ModelForm):
    class Meta:
        model = Bundle
        fields = ('name', 'description')


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
