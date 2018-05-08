from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from oscar.core.loading import get_model
from oscarbundles.models import Bundle, BundleGroup
from oscarbundles.api.serializers import (
    BundleSerializer,
    BundleGroupSerializer,
    ProductSerializer,
)

Product = get_model('catalogue', 'Product')

API_PERMS = (permissions.DjangoModelPermissionsOrAnonReadOnly, )


class ProductBundleList(generics.ListAPIView):
    permission_classes = (permissions.AllowAny, )
    serializer_class = BundleSerializer

    def get(self, request, pk):
        self.product = get_object_or_404(Product, pk=pk)
        return super().get(request, pk)


    def get_queryset(self):
        qs = Bundle.objects.order_by('id')
        qs = qs.filter(triggering_product=self.product)
        return qs.all()



class BundleList(generics.ListAPIView):
    permission_classes = API_PERMS
    queryset = Bundle.objects\
        .prefetch_related('triggering_product', 'suggested_products')\
        .order_by('id')
    serializer_class = BundleSerializer



class BundleDetail(generics.RetrieveAPIView):
    permission_classes = API_PERMS
    queryset = Bundle.objects.order_by('id')
    serializer_class = BundleSerializer



class BundleGroupList(generics.ListCreateAPIView):
    permission_classes = API_PERMS
    queryset = BundleGroup.objects\
        .prefetch_related(
            'triggering_parents',
            'suggested_parents',
            'bundles',
            'bundles__triggering_product',
            'bundles__suggested_products')\
        .order_by('id')
    serializer_class = BundleGroupSerializer


class BundleGroupDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.DjangoModelPermissionsOrAnonReadOnly, )
    queryset = BundleGroup.objects.order_by('id')
    serializer_class = BundleGroupSerializer



class BundleProductChoicesList(generics.ListAPIView):
    permission_classes = API_PERMS
    queryset = Product.objects\
        .prefetch_related('product_class', 'children')\
        .order_by('id')
    serializer_class = ProductSerializer
