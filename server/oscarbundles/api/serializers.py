from collections.abc import Sequence
from typing import TYPE_CHECKING, NotRequired, TypedDict

from oscar.core.loading import get_model
from rest_framework import serializers

from ..models import BundleGroup, ConcreteBundle, UserConfigurableBundle

if TYPE_CHECKING:
    from oscar.apps.catalogue.models import Product, ProductClass
    from oscar.apps.offer.models import Range
    from rest_framework.validators import Validator
else:
    ProductClass = get_model("catalogue", "ProductClass")
    Product = get_model("catalogue", "Product")
    Range = get_model("offer", "Range")


# =============================================================================
# Inline Serializers
# =============================================================================
class InlineBundleGroupSerializer(serializers.ModelSerializer[BundleGroup]):
    class Meta:
        model = BundleGroup
        fields = (
            "id",
            "bundle_type",
            "name",
            "is_active",
            "headline",
            "description",
            "image",
        )


class InlineConcreteBundleData(TypedDict):
    id: int
    triggering_product: int
    suggested_products: Sequence[int]


class InlineConcreteBundleSerializer(serializers.ModelSerializer[ConcreteBundle]):
    class Meta:
        model = ConcreteBundle
        fields = (
            "id",
            "triggering_product",
            "suggested_products",
        )
        # Remove the default "unique together" validator
        validators: Sequence["Validator[ConcreteBundle]"] = []


class InlineUserConfigurableBundleData(TypedDict):
    id: int
    triggering_product: int
    suggested_range: Sequence[int]
    quantity: int


class InlineUserConfigurableBundleSerializer(
    serializers.ModelSerializer[UserConfigurableBundle]
):
    class Meta:
        model = UserConfigurableBundle
        fields = ("id", "triggering_product", "suggested_range", "quantity")
        # Remove the default "unique together" validator
        validators: Sequence["Validator[UserConfigurableBundle]"] = []


# =============================================================================
# Product Serializers
# =============================================================================
class ProductClassSerializer(serializers.ModelSerializer[ProductClass]):
    class Meta:
        model = ProductClass
        fields = ("id", "name")


class ProductSerializer(serializers.ModelSerializer[Product]):
    dashboard_url = serializers.HyperlinkedIdentityField(
        view_name="dashboard:catalogue-product"
    )
    product_class = ProductClassSerializer()

    class Meta:
        model = Product
        fields = (
            "id",
            "dashboard_url",
            "product_class",
            "title",
            "slug",
            "is_parent",
            "is_child",
            "parent",
            "children",
        )


# =============================================================================
# Range Serializers
# =============================================================================
class RangeSerializer(serializers.ModelSerializer[Range]):
    dashboard_url = serializers.HyperlinkedIdentityField(
        view_name="dashboard:range-update"
    )

    class Meta:
        model = Range
        fields = (
            "id",
            "dashboard_url",
            "name",
            "slug",
            "description",
        )


# =============================================================================
# Concrete Bundle Serializers
# =============================================================================
class ConcreteBundleSerializer(serializers.ModelSerializer[ConcreteBundle]):
    bundle_group = InlineBundleGroupSerializer()

    class Meta:
        model = ConcreteBundle
        fields = (
            "id",
            "bundle_group",
            "triggering_product",
            "suggested_products",
        )


# =============================================================================
# User Configurable Bundle Serializers
# =============================================================================
class UserConfigurableBundleSerializer(
    serializers.ModelSerializer[UserConfigurableBundle]
):
    bundle_group = InlineBundleGroupSerializer()
    suggested_range_products = serializers.SerializerMethodField()

    class Meta:
        model = UserConfigurableBundle
        fields = (
            "id",
            "bundle_group",
            "triggering_product",
            "suggested_range",
            "suggested_range_products",
            "quantity",
        )

    def get_suggested_range_products(
        self,
        obj: UserConfigurableBundle,
    ) -> Sequence[int]:
        return (  # type:ignore[no-any-return]
            obj.suggested_range.all_products()
            .exclude(structure=Product.CHILD)
            .values_list("pk", flat=True)
        )


# =============================================================================
# Bundle Group Serializers
# =============================================================================
class BundleGroupData(TypedDict):
    id: NotRequired[int]
    bundle_type: str
    name: NotRequired[str]
    headline: NotRequired[str]
    is_active: bool
    description: NotRequired[str]
    image: NotRequired[bool]
    triggering_parents: Sequence[Product]
    suggested_parents: Sequence[Product]
    concrete_bundles: Sequence[InlineConcreteBundleData]
    user_configurable_bundles: Sequence[InlineUserConfigurableBundleData]


class BundleGroupSerializer(serializers.ModelSerializer[BundleGroup]):
    image = serializers.ImageField(use_url=True, allow_null=True, required=False)
    concrete_bundles = InlineConcreteBundleSerializer(many=True)
    user_configurable_bundles = InlineUserConfigurableBundleSerializer(many=True)

    class Meta:
        model = BundleGroup
        fields = (
            "id",
            "bundle_type",
            "name",
            "headline",
            "is_active",
            "description",
            "image",
            "triggering_parents",
            "suggested_parents",
            "concrete_bundles",
            "user_configurable_bundles",
        )

    def create(self, validated_data: BundleGroupData) -> BundleGroup:
        group = BundleGroup.objects.create(
            bundle_type=validated_data["bundle_type"],
            name=validated_data.get("name", ""),
            headline=validated_data.get("headline", ""),
            is_active=validated_data.get("is_active", True),
            description=validated_data.get("description", ""),
            image=validated_data.get("image", None),
        )
        group.triggering_parents.set(validated_data.get("triggering_parents", []))
        group.suggested_parents.set(validated_data.get("suggested_parents", []))
        group.save()
        self._update_concrete_bundles(group, validated_data.get("concrete_bundles", []))
        self._update_user_configurable_bundles(
            group, validated_data.get("user_configurable_bundles", [])
        )
        return group

    def update(
        self,
        group: BundleGroup,
        validated_data: BundleGroupData,
    ) -> BundleGroup:
        group.bundle_type = validated_data.get("bundle_type", group.bundle_type)
        group.name = validated_data.get("name", group.name)
        group.headline = validated_data.get("headline", group.headline)
        group.is_active = validated_data.get("is_active", group.is_active)
        group.description = validated_data.get("description", group.description)
        if "image" in validated_data:
            group.image = validated_data["image"]
        group.save()
        if "triggering_parents" in validated_data:
            group.triggering_parents.set(validated_data["triggering_parents"])
        if "suggested_parents" in validated_data:
            group.suggested_parents.set(validated_data["suggested_parents"])
        if (
            "concrete_bundles" in validated_data
            and len(validated_data["concrete_bundles"]) > 0
        ):
            self._update_concrete_bundles(group, validated_data["concrete_bundles"])
        if (
            "user_configurable_bundles" in validated_data
            and len(validated_data["user_configurable_bundles"]) > 0
        ):
            self._update_user_configurable_bundles(
                group, validated_data.get("user_configurable_bundles", [])
            )
        return group

    def _update_concrete_bundles(
        self,
        group: BundleGroup,
        bundles: Sequence[InlineConcreteBundleData],
    ) -> Sequence[ConcreteBundle]:
        instances = []
        for bundle_data in bundles:
            bundle, _ = ConcreteBundle.objects.get_or_create(
                bundle_group=group, triggering_product=bundle_data["triggering_product"]
            )
            bundle.suggested_products.set(bundle_data["suggested_products"])
            instances.append(bundle)
        instance_ids = [b.pk for b in instances]
        ConcreteBundle.objects.filter(bundle_group=group).exclude(
            pk__in=instance_ids
        ).all().delete()
        return instances

    def _update_user_configurable_bundles(
        self,
        group: BundleGroup,
        bundles: Sequence[InlineUserConfigurableBundleData],
    ) -> Sequence[UserConfigurableBundle]:
        instances = []
        for bundle_data in bundles:
            bundle, _ = UserConfigurableBundle.objects.get_or_create(
                bundle_group=group,
                triggering_product=bundle_data["triggering_product"],
                suggested_range=bundle_data["suggested_range"],
            )
            bundle.quantity = bundle_data["quantity"]
            bundle.save()
            instances.append(bundle)
        instance_ids = [b.pk for b in instances]
        UserConfigurableBundle.objects.filter(bundle_group=group).exclude(
            pk__in=instance_ids
        ).all().delete()
        return instances
