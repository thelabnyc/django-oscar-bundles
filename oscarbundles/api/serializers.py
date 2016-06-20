from rest_framework import serializers
from oscar.core.loading import get_model

Product = get_model('catalogue', 'Product')
Bundle = get_model('oscarbundles', 'Bundle')


class BundleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bundle
        fields = ('url', 'id', 'name', 'description', 'triggering_products', 'suggested_products')
