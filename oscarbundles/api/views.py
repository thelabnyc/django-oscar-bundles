from django.shortcuts import get_object_or_404
from rest_framework import generics
from oscar.core.loading import get_model, get_class

Product = get_model('catalogue', 'Product')
Bundle = get_model('oscarbundles', 'Bundle')
BundleGroup = get_model('oscarbundles', 'BundleGroup')

BundleSerializer = get_class('oscarbundles.api.serializers', 'BundleSerializer')
BundleGroupSerializer = get_class('oscarbundles.api.serializers', 'BundleGroupSerializer')


class BundleList(generics.ListAPIView):
    queryset = Bundle.objects.order_by('id')
    serializer_class = BundleSerializer


class BundleDetail(generics.RetrieveAPIView):
    queryset = Bundle.objects.order_by('id')
    serializer_class = BundleSerializer


class ProductBundleList(generics.ListAPIView):
    serializer_class = BundleSerializer

    def get_queryset(self):
        qs = Bundle.objects.order_by('id')
        qs = qs.filter(triggering_products=self.product)
        return qs.all()

    def list(self, request, pk):
        self.product = get_object_or_404(Product, pk=pk)
        return super().list(request, pk)


class BundleGroupDetail(generics.RetrieveAPIView):
    queryset = BundleGroup.objects.order_by('id')
    serializer_class = BundleGroupSerializer
