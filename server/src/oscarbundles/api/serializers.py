from rest_framework import serializers
from oscar.core.loading import get_model
from ..models import Bundle, BundleGroup

ProductClass = get_model('catalogue', 'ProductClass')
Product = get_model('catalogue', 'Product')



class ProductClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductClass
        fields = ('id', 'name')



class ProductSerializer(serializers.ModelSerializer):
    dashboard_url = serializers.HyperlinkedIdentityField(view_name='dashboard:catalogue-product')
    product_class = ProductClassSerializer()

    class Meta:
        model = Product
        fields = (
            'id', 'dashboard_url', 'product_class', 'title', 'slug', 'is_parent', 'is_child',
            'parent', 'children',
        )


class InlineBundleGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = BundleGroup
        fields = (
            'id', 'bundle_type', 'name', 'headline', 'description', 'image',
        )


class BundleSerializer(serializers.ModelSerializer):
    bundle_group = InlineBundleGroupSerializer()

    class Meta:
        model = Bundle
        fields = (
            'id', 'bundle_group', 'triggering_product', 'suggested_products',
        )


class InlineBundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bundle
        fields = (
            'id', 'triggering_product', 'suggested_products',
        )
        validators = []  # Remove the default "unique together" validator


class BundleGroupSerializer(serializers.ModelSerializer):
    bundles = InlineBundleSerializer(many=True)

    class Meta:
        model = BundleGroup
        fields = (
            'id', 'bundle_type', 'name', 'headline', 'description', 'image', 'triggering_parents', 'suggested_parents', 'bundles',
        )


    def create(self, validated_data):
        group = BundleGroup.objects.create(
            bundle_type=validated_data.get('bundle_type', None),
            name=validated_data.get('name', ''),
            headline=validated_data.get('headline', ''),
            description=validated_data.get('description', ''),
            image=validated_data.get('image', None))
        group.triggering_parents.set(validated_data.get('triggering_parents', []))
        group.suggested_parents.set(validated_data.get('suggested_parents', []))
        group.save()
        self._update_bundles(group, validated_data.get('bundles', []))
        return group


    def update(self, group, validated_data):
        group.bundle_type = validated_data.get('bundle_type', group.bundle_type)
        group.name = validated_data.get('name', group.name)
        group.headline = validated_data.get('headline', group.headline)
        group.description = validated_data.get('description', group.description)
        if 'image' in validated_data:
            group.image = validated_data['image']
        group.save()
        if 'triggering_parents' in validated_data:
            group.triggering_parents.set(validated_data['triggering_parents'])
        if 'suggested_parents' in validated_data:
            group.suggested_parents.set(validated_data['suggested_parents'])
        if 'bundles' in validated_data and len(validated_data['bundles']) > 0:
            self._update_bundles(group, validated_data['bundles'])
        return group


    def _update_bundles(self, group, bundles):
        instances = []
        for bundle_data in bundles:
            bundle, _ = Bundle.objects.get_or_create(
                bundle_group=group,
                triggering_product=bundle_data['triggering_product'])
            bundle.suggested_products.set(bundle_data['suggested_products'])
            instances.append(bundle)
        instance_ids = [b.pk for b in instances]
        Bundle.objects\
            .filter(bundle_group=group)\
            .exclude(pk__in=instance_ids)\
            .all()\
            .delete()
        return instances
