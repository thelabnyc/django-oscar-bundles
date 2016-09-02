from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from oscar.core.loading import get_model
from oscar.test.factories import create_product

Bundle = get_model('oscarbundles', 'Bundle')
BundleGroup = get_model('oscarbundles', 'BundleGroup')


class BundleAPITest(APITestCase):
    def setUp(self):
        self.product1 = create_product()
        self.product2 = create_product()
        self.product3 = create_product()
        self.product4 = create_product()

        self.bundle_group1 = BundleGroup()
        self.bundle_group1.name = "A bundle of bundles"
        self.bundle_group1.save()

        self.bundle1 = Bundle()
        self.bundle1.name = 'My Bundle'
        self.bundle1.description = 'A description of my bundle'
        self.bundle1.save()
        self.bundle1.triggering_products.add(self.product1)
        self.bundle1.triggering_products.add(self.product2)
        self.bundle1.suggested_products.add(self.product3)
        self.bundle1.suggested_products.add(self.product4)

        self.bundle2 = Bundle()
        self.bundle2.name = 'My Other Bundle'
        self.bundle2.description = 'A description of my other bundle'
        self.bundle2.bundle_group = self.bundle_group1
        self.bundle2.save()
        self.bundle2.triggering_products.add(self.product2)
        self.bundle2.suggested_products.add(self.product1)
        self.bundle2.suggested_products.add(self.product4)

    def test_list(self):
        url = reverse('bundle-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [
            {
                'url': 'http://testserver/api/bundles/%s/' % self.bundle1.pk,
                'id': self.bundle1.pk,
                'name': 'My Bundle',
                'description': 'A description of my bundle',
                'bundle_group': None,
                'triggering_products': [
                    'http://testserver/api/products/%s/' % self.product2.pk,
                    'http://testserver/api/products/%s/' % self.product1.pk,
                ],
                'suggested_products': [
                    'http://testserver/api/products/%s/' % self.product4.pk,
                    'http://testserver/api/products/%s/' % self.product3.pk,
                ],
            },
            {
                'url': 'http://testserver/api/bundles/%s/' % self.bundle2.pk,
                'id': self.bundle2.pk,
                'name': 'My Other Bundle',
                'description': 'A description of my other bundle',
                'bundle_group': {
                    "url": "http://testserver/api/bundle_groups/%s/" % self.bundle_group1.pk,
                    "id": self.bundle_group1.pk,
                    "name": self.bundle_group1.name,
                    "description": self.bundle_group1.description,
                    "image": None
                },
                'triggering_products': [
                    'http://testserver/api/products/%s/' % self.product2.pk,
                ],
                'suggested_products': [
                    'http://testserver/api/products/%s/' % self.product4.pk,
                    'http://testserver/api/products/%s/' % self.product1.pk,
                ],
            },
        ])

    def test_detail(self):
        url = reverse('bundle-detail', args=(self.bundle1.pk, ))
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, {
            'url': 'http://testserver/api/bundles/%s/' % self.bundle1.pk,
            'id': self.bundle1.pk,
            'name': 'My Bundle',
            'description': 'A description of my bundle',
            'bundle_group': None,
            'triggering_products': [
                'http://testserver/api/products/%s/' % self.product2.pk,
                'http://testserver/api/products/%s/' % self.product1.pk,
            ],
            'suggested_products': [
                'http://testserver/api/products/%s/' % self.product4.pk,
                'http://testserver/api/products/%s/' % self.product3.pk,
            ],
        })

    def test_product_list(self):
        url = reverse('product-bundle-list', args=(self.product1.pk, ))
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [
            {
                'url': 'http://testserver/api/bundles/%s/' % self.bundle1.pk,
                'id': self.bundle1.pk,
                'name': 'My Bundle',
                'description': 'A description of my bundle',
                'bundle_group': None,
                'triggering_products': [
                    'http://testserver/api/products/%s/' % self.product2.pk,
                    'http://testserver/api/products/%s/' % self.product1.pk,
                ],
                'suggested_products': [
                    'http://testserver/api/products/%s/' % self.product4.pk,
                    'http://testserver/api/products/%s/' % self.product3.pk,
                ],
            },
        ])

        url = reverse('product-bundle-list', args=(self.product2.pk, ))
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [
            {
                'url': 'http://testserver/api/bundles/%s/' % self.bundle1.pk,
                'id': self.bundle1.pk,
                'name': 'My Bundle',
                'description': 'A description of my bundle',
                'bundle_group': None,
                'triggering_products': [
                    'http://testserver/api/products/%s/' % self.product2.pk,
                    'http://testserver/api/products/%s/' % self.product1.pk,
                ],
                'suggested_products': [
                    'http://testserver/api/products/%s/' % self.product4.pk,
                    'http://testserver/api/products/%s/' % self.product3.pk,
                ],
            },
            {
                'url': 'http://testserver/api/bundles/%s/' % self.bundle2.pk,
                'id': self.bundle2.pk,
                'name': 'My Other Bundle',
                'description': 'A description of my other bundle',
                'bundle_group': {
                    "url": "http://testserver/api/bundle_groups/%s/" % self.bundle_group1.pk,
                    "id": self.bundle_group1.pk,
                    "name": self.bundle_group1.name,
                    "description": self.bundle_group1.description,
                    "image": None
                },
                'triggering_products': [
                    'http://testserver/api/products/%s/' % self.product2.pk,
                ],
                'suggested_products': [
                    'http://testserver/api/products/%s/' % self.product4.pk,
                    'http://testserver/api/products/%s/' % self.product1.pk,
                ],
            },
        ])
