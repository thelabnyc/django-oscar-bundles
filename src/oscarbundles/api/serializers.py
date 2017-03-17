from rest_framework import serializers
from oscar.core.loading import get_model

Bundle = get_model('oscarbundles', 'Bundle')
BundleGroup = get_model('oscarbundles', 'BundleGroup')


class BundleGroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = BundleGroup
        fields = ('url', 'id', 'name', 'description', 'image')


class BundleSerializer(serializers.HyperlinkedModelSerializer):
    bundle_group = BundleGroupSerializer()

    class Meta:
        model = Bundle
        fields = (
            'url', 'id', 'name', 'description', 'bundle_group',
            'triggering_products', 'suggested_products')
