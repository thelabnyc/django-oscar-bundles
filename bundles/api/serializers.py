from rest_framework import serializers
from oscar.core.loading import get_model
from .. import models

Product = get_model('catalogue', 'Product')


class BundleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Bundle
        fields = ('url', 'id', 'name', 'description', 'triggering_products', 'suggested_products')
