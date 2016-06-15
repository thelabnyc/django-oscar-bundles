from django.shortcuts import get_object_or_404
from rest_framework import generics
from oscar.core.loading import get_model
from .. import models
from . import serializers

Product = get_model('catalogue', 'Product')


class BundleList(generics.ListAPIView):
    queryset = models.Bundle.objects.order_by('id')
    serializer_class = serializers.BundleSerializer


class BundleDetail(generics.RetrieveAPIView):
    queryset = models.Bundle.objects.order_by('id')
    serializer_class = serializers.BundleSerializer


class ProductBundleList(generics.ListAPIView):
    serializer_class = serializers.BundleSerializer

    def get_queryset(self):
        qs = models.Bundle.objects.order_by('id')
        qs = qs.filter(triggering_products=self.product)
        return qs.all()

    def list(self, request, pk):
        self.product = get_object_or_404(Product, pk=pk)
        return super().list(request, pk)
