from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from oscar.core.loading import get_model
from oscarbundles.models import (
    BundleGroup,
    ConcreteBundle,
    UserConfigurableBundle,
)
from oscarbundles.api.serializers import (
    ProductSerializer,
    RangeSerializer,
    BundleGroupSerializer,
    ConcreteBundleSerializer,
    UserConfigurableBundleSerializer,
)

Product = get_model("catalogue", "Product")
Range = get_model("offer", "Range")

API_PERMS = (permissions.DjangoModelPermissionsOrAnonReadOnly,)


# =============================================================================
# Bundles by Product
# =============================================================================
class ProductConcreteBundleList(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ConcreteBundleSerializer

    def get(self, request, pk):
        self.product = get_object_or_404(Product, pk=pk)
        return super().get(request, pk)

    def get_queryset(self):
        qs = ConcreteBundle.objects.order_by("id")
        qs = qs.filter(triggering_product=self.product, bundle_group__is_active=True)
        return qs.all()


class ProductUserConfigurableBundleList(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserConfigurableBundleSerializer

    def get(self, request, pk):
        self.product = get_object_or_404(Product, pk=pk)
        return super().get(request, pk)

    def get_queryset(self):
        qs = UserConfigurableBundle.objects.order_by("id")
        qs = qs.filter(triggering_product=self.product, bundle_group__is_active=True)
        return qs.all()


# =============================================================================
# Bundle Groups
# =============================================================================
class BundleGroupTypeList(generics.ListAPIView):
    permission_classes = API_PERMS
    queryset = BundleGroup.objects.get_queryset()

    def get(self, request):
        choices = [
            {
                "display_name": label,
                "value": value,
            }
            for value, label in BundleGroup.GROUP_TYPE_OPTIONS
        ]
        return Response(choices)


class BundleGroupList(generics.ListCreateAPIView):
    permission_classes = API_PERMS
    queryset = BundleGroup.objects.prefetch_related(
        "triggering_parents",
        "suggested_parents",
        "concrete_bundles",
        "concrete_bundles__triggering_product",
        "concrete_bundles__suggested_products",
        "user_configurable_bundles",
    ).order_by("id")
    serializer_class = BundleGroupSerializer


class BundleGroupDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = API_PERMS
    queryset = BundleGroup.objects.order_by("id")
    serializer_class = BundleGroupSerializer


# =============================================================================
# Concrete Bundles
# =============================================================================
class ConcreteBundleList(generics.ListAPIView):
    permission_classes = API_PERMS
    queryset = (
        ConcreteBundle.objects.select_related("bundle_group")
        .prefetch_related("triggering_product", "suggested_products")
        .order_by("id")
    )
    serializer_class = ConcreteBundleSerializer


class ConcreteBundleDetail(generics.RetrieveAPIView):
    permission_classes = API_PERMS
    queryset = (
        ConcreteBundle.objects.select_related("bundle_group")
        .prefetch_related("triggering_product", "suggested_products")
        .order_by("id")
    )
    serializer_class = ConcreteBundleSerializer


class ConcreteBundleProductChoicesList(generics.ListAPIView):
    permission_classes = API_PERMS
    queryset = Product.objects.prefetch_related("product_class", "children").order_by(
        "id"
    )
    serializer_class = ProductSerializer


# =============================================================================
# User Configurable Bundles
# =============================================================================
class UserConfigurableBundleList(generics.ListAPIView):
    permission_classes = API_PERMS
    queryset = UserConfigurableBundle.objects.order_by("id")
    serializer_class = UserConfigurableBundleSerializer


class UserConfigurableBundleDetail(generics.RetrieveAPIView):
    permission_classes = API_PERMS
    queryset = UserConfigurableBundle.objects.order_by("id")
    serializer_class = UserConfigurableBundleSerializer


class UserConfigurableBundleRangeChoicesList(generics.ListAPIView):
    permission_classes = API_PERMS
    queryset = Range.objects.order_by("id")
    serializer_class = RangeSerializer
