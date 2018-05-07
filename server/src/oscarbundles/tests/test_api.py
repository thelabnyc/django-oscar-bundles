from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from oscar.test.factories import create_product
from ..models import Bundle, BundleGroup


class BundleAPITest(APITestCase):
    def setUp(self):
        self.product1 = create_product()
        self.product2 = create_product()
        self.product3 = create_product()
        self.product4 = create_product()

        self.bundle_name = "A bundle of bundles"
        self.bundle_headline = "We want you to buy one of these"

        self.bundle_group1 = BundleGroup()
        self.bundle_group1.name = self.bundle_name
        self.bundle_group1.headline = self.bundle_headline
        self.bundle_group1.save()
        self.bundle_group1.triggering_parents.set([self.product1, self.product2])
        self.bundle_group1.suggested_parents.set([self.product3, self.product4])

        self.bundle_group2 = BundleGroup()
        self.bundle_group2.name = self.bundle_name
        self.bundle_group2.save()
        self.bundle_group2.triggering_parents.set([self.product2])
        self.bundle_group2.suggested_parents.set([self.product1, self.product4])

        self.bundle1 = Bundle()
        self.bundle1.bundle_group = self.bundle_group1
        self.bundle1.triggering_product = self.product1
        self.bundle1.save()
        self.bundle1.suggested_products.add(self.product3)
        self.bundle1.suggested_products.add(self.product4)

        self.bundle2 = Bundle()
        self.bundle2.bundle_group = self.bundle_group1
        self.bundle2.triggering_product = self.product2
        self.bundle2.save()
        self.bundle2.suggested_products.add(self.product3)
        self.bundle2.suggested_products.add(self.product4)

        self.bundle3 = Bundle()
        self.bundle3.bundle_group = self.bundle_group2
        self.bundle3.triggering_product = self.product2
        self.bundle3.save()
        self.bundle3.suggested_products.add(self.product1)
        self.bundle3.suggested_products.add(self.product4)


    def test_list(self):
        url = reverse('bundle-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [
            {
                'id': self.bundle1.pk,
                'bundle_group': {
                    'id': self.bundle_group1.pk,
                    'bundle_type': 'default',
                    'name': self.bundle_name,
                    'headline': self.bundle_headline,
                    'description': '',
                    'image': None,
                },
                'triggering_product': self.product1.pk,
                'suggested_products': [self.product4.pk, self.product3.pk],
            },
            {
                'id': self.bundle2.pk,
                'bundle_group': {
                    'id': self.bundle_group1.pk,
                    'bundle_type': 'default',
                    'name': self.bundle_name,
                    'headline': self.bundle_headline,
                    'description': '',
                    'image': None,
                },
                'triggering_product': self.product2.pk,
                'suggested_products': [self.product4.pk, self.product3.pk],
            },
            {
                'id': self.bundle3.pk,
                'bundle_group': {
                    'id': self.bundle_group2.pk,
                    'bundle_type': 'default',
                    'name': self.bundle_name,
                    'headline': 'Forget Something?',
                    'description': '',
                    'image': None,
                },
                'triggering_product': self.product2.pk,
                'suggested_products': [self.product4.pk, self.product1.pk],
            },
        ])


    def test_detail(self):
        url = reverse('bundle-detail', args=(self.bundle1.pk, ))
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, {
            'id': self.bundle1.pk,
            'bundle_group': {
                'id': self.bundle_group1.pk,
                'bundle_type': 'default',
                'name': self.bundle_name,
                'headline': self.bundle_headline,
                'description': '',
                'image': None,
            },
            'triggering_product': self.product1.pk,
            'suggested_products': [self.product4.pk, self.product3.pk],
        })


    def test_product_list(self):
        url = reverse('product-bundle-list', args=(self.product1.pk, ))
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [
            {
                'id': self.bundle1.pk,
                'bundle_group': {
                    'id': self.bundle_group1.pk,
                    'bundle_type': 'default',
                    'name': self.bundle_name,
                    'headline': self.bundle_headline,
                    'description': '',
                    'image': None,
                },
                'triggering_product': self.product1.pk,
                'suggested_products': [self.product4.pk, self.product3.pk],
            },
        ])

        url = reverse('product-bundle-list', args=(self.product2.pk, ))
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [
            {
                'id': self.bundle2.pk,
                'bundle_group': {
                    'id': self.bundle_group1.pk,
                    'bundle_type': 'default',
                    'name': self.bundle_name,
                    'headline': self.bundle_headline,
                    'description': '',
                    'image': None,
                },
                'triggering_product': self.product2.pk,
                'suggested_products': [self.product4.pk, self.product3.pk],
            },
            {
                'id': self.bundle3.pk,
                'bundle_group': {
                    'id': self.bundle_group2.pk,
                    'bundle_type': 'default',
                    'name': self.bundle_name,
                    'headline': 'Forget Something?',
                    'description': '',
                    'image': None,
                },
                'triggering_product': self.product2.pk,
                'suggested_products': [self.product4.pk, self.product1.pk],
            },
        ])
