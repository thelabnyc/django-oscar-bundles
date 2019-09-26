from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from oscar.test.factories import create_product
from oscar.core.loading import get_model
from ..models import (
    BundleGroup,
    ConcreteBundle,
    UserConfigurableBundle,
)

Range = get_model('offer', 'Range')



class ConcreteBundleAPITest(APITestCase):
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

        self.bundle1 = ConcreteBundle()
        self.bundle1.bundle_group = self.bundle_group1
        self.bundle1.triggering_product = self.product1
        self.bundle1.save()
        self.bundle1.suggested_products.add(self.product3)
        self.bundle1.suggested_products.add(self.product4)

        self.bundle2 = ConcreteBundle()
        self.bundle2.bundle_group = self.bundle_group1
        self.bundle2.triggering_product = self.product2
        self.bundle2.save()
        self.bundle2.suggested_products.add(self.product3)
        self.bundle2.suggested_products.add(self.product4)

        self.bundle3 = ConcreteBundle()
        self.bundle3.bundle_group = self.bundle_group2
        self.bundle3.triggering_product = self.product2
        self.bundle3.save()
        self.bundle3.suggested_products.add(self.product1)
        self.bundle3.suggested_products.add(self.product4)


    def test_list(self):
        url = reverse('concretebundle-list')
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
        url = reverse('concretebundle-detail', args=(self.bundle1.pk, ))
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


    def test_product_choices_list(self):
        url = reverse('concretebundle-product-choice-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 4)
        self.assertDictEqual(resp.data[0], {
            "id": self.product1.pk,
            "dashboard_url": "http://testserver/dashboard/catalogue/products/%s/" % self.product1.pk,
            "product_class": {
                "id": self.product1.product_class.pk,
                "name": "Dùｍϻϒ item class"
            },
            "title": "Dùｍϻϒ title",
            "slug": "dumu03fbu03a5-title",
            "is_parent": False,
            "is_child": False,
            "parent": None,
            "children": [],
        })


    def test_product_list(self):
        url = reverse('product-concretebundle-list', args=(self.product1.pk, ))
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

        url = reverse('product-concretebundle-list', args=(self.product2.pk, ))
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



class UserConfigurableBundleAPITest(APITestCase):
    def setUp(self):
        self.product1 = create_product()
        self.product2 = create_product()
        self.product3 = create_product()
        self.product4 = create_product()

        self.rangeA = Range.objects.create(name='RangeA')
        self.rangeA.add_product(self.product3)
        self.rangeA.add_product(self.product4)

        self.rangeB = Range.objects.create(name='RangeB')
        self.rangeB.add_product(self.product1)
        self.rangeB.add_product(self.product4)

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

        self.bundle1 = UserConfigurableBundle()
        self.bundle1.bundle_group = self.bundle_group1
        self.bundle1.triggering_product = self.product1
        self.bundle1.suggested_range = self.rangeA
        self.bundle1.quantity = 1
        self.bundle1.save()

        self.bundle2 = UserConfigurableBundle()
        self.bundle2.bundle_group = self.bundle_group1
        self.bundle2.triggering_product = self.product2
        self.bundle2.suggested_range = self.rangeA
        self.bundle2.quantity = 2
        self.bundle2.save()

        self.bundle3 = UserConfigurableBundle()
        self.bundle3.bundle_group = self.bundle_group2
        self.bundle3.triggering_product = self.product2
        self.bundle3.suggested_range = self.rangeB
        self.bundle3.quantity = 3
        self.bundle3.save()


    def test_list(self):
        url = reverse('userconfigurablebundle-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data[0]['id'], self.bundle1.pk)
        self.assertEqual(resp.data[0]['bundle_group'], {
            'id': self.bundle_group1.pk,
            'bundle_type': 'default',
            'name': self.bundle_name,
            'headline': self.bundle_headline,
            'description': '',
            'image': None,
        }),
        self.assertEqual(resp.data[0]['triggering_product'], self.product1.pk)
        self.assertEqual(resp.data[0]['suggested_range'], self.rangeA.pk)
        self.assertEqual(set(resp.data[0]['suggested_range_products']), set([self.product3.pk, self.product4.pk]))
        self.assertEqual(resp.data[0]['quantity'], 1)


    def test_detail(self):
        url = reverse('userconfigurablebundle-detail', args=(self.bundle1.pk, ))
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['id'], self.bundle1.pk)
        self.assertEqual(resp.data['bundle_group'], {
            'id': self.bundle_group1.pk,
            'bundle_type': 'default',
            'name': self.bundle_name,
            'headline': self.bundle_headline,
            'description': '',
            'image': None,
        }),
        self.assertEqual(resp.data['triggering_product'], self.product1.pk)
        self.assertEqual(resp.data['suggested_range'], self.rangeA.pk)
        self.assertEqual(set(resp.data['suggested_range_products']), set([self.product3.pk, self.product4.pk]))
        self.assertEqual(resp.data['quantity'], 1)


    def test_range_list(self):
        url = reverse('userconfigurablebundle-range-choice-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, [
            {
                "id": self.rangeA.pk,
                "dashboard_url": 'http://testserver/dashboard/ranges/%s/' % self.rangeA.pk,
                "name": "RangeA",
                "slug": "rangea",
                "description": "",
            },
            {
                "id": self.rangeB.pk,
                "dashboard_url": 'http://testserver/dashboard/ranges/%s/' % self.rangeB.pk,
                "name": "RangeB",
                "slug": "rangeb",
                "description": "",
            }
        ])



class BundleGroupAPITest(APITestCase):
    def setUp(self):
        self.product1 = create_product()
        self.product2 = create_product()
        self.product3 = create_product()
        self.product4 = create_product()

        self.rangeA = Range.objects.create(name='RangeA')
        self.rangeA.add_product(self.product3)
        self.rangeA.add_product(self.product4)

        self.rangeB = Range.objects.create(name='RangeB')
        self.rangeB.add_product(self.product1)
        self.rangeB.add_product(self.product4)

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

        self.bundle1 = UserConfigurableBundle()
        self.bundle1.bundle_group = self.bundle_group1
        self.bundle1.triggering_product = self.product1
        self.bundle1.suggested_range = self.rangeA
        self.bundle1.quantity = 1
        self.bundle1.save()

        self.bundle2 = UserConfigurableBundle()
        self.bundle2.bundle_group = self.bundle_group1
        self.bundle2.triggering_product = self.product2
        self.bundle2.suggested_range = self.rangeA
        self.bundle2.quantity = 2
        self.bundle2.save()

        self.bundle3 = ConcreteBundle()
        self.bundle3.bundle_group = self.bundle_group2
        self.bundle3.triggering_product = self.product2
        self.bundle3.save()
        self.bundle3.suggested_products.add(self.product1)
        self.bundle3.suggested_products.add(self.product4)

        self.user = User.objects.create_user(
            username='root',
            password='root',
            is_staff=True,
            is_superuser=True)


    def test_list(self):
        self.maxDiff = None
        url = reverse('bundlegroup-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 2)
        self.assertEqual(resp.data[0]["name"], "A bundle of bundles")


    def test_create(self):
        self.maxDiff = None
        self.client.login(username='root', password='root')
        url = reverse('bundlegroup-list')
        resp = self.client.post(url, {
            "bundle_type": "default",
            "name": "test bundle 1",
            "headline": "test headline",
            "description": "test description",
            "triggering_parents": [self.product1.pk],
            "suggested_parents": [self.product2.pk],
            "concrete_bundles": [
                {
                    "triggering_product": self.product1.pk,
                    "suggested_products": [self.product2.pk],
                },
            ],
            "user_configurable_bundles": [
                {
                    "triggering_product": self.product1.pk,
                    "suggested_range": self.rangeA.pk,
                    "quantity": 2,
                },
            ]
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        bundlegroup = BundleGroup.objects.get(name="test bundle 1")

        data = dict(resp.data)
        data['concrete_bundles'][0] = dict(data['concrete_bundles'][0])
        data['user_configurable_bundles'][0] = dict(data['user_configurable_bundles'][0])
        self.assertDictEqual(data, {
            "id": bundlegroup.pk,
            "bundle_type": "default",
            "name": "test bundle 1",
            "headline": "test headline",
            "description": "test description",
            "image": None,
            "triggering_parents": [self.product1.pk],
            "suggested_parents": [self.product2.pk],
            "concrete_bundles": [
                {
                    "id": bundlegroup.concrete_bundles.first().pk,
                    "triggering_product": self.product1.pk,
                    "suggested_products": [self.product2.pk],
                },
            ],
            "user_configurable_bundles": [
                {
                    "id": bundlegroup.user_configurable_bundles.first().pk,
                    "triggering_product": self.product1.pk,
                    "suggested_range": self.rangeA.pk,
                    "quantity": 2,
                },
            ]
        })


    def test_update(self):
        self.maxDiff = None
        self.client.login(username='root', password='root')

        self.bundle_group1.refresh_from_db()
        self.assertEqual(self.bundle_group1.name, "A bundle of bundles")

        url = reverse('bundlegroup-detail', args=(self.bundle_group1.pk, ))
        resp = self.client.put(url, {
            "bundle_type": "default",
            "name": "test bundle 1",
            "headline": "test headline",
            "description": "test description",
            "triggering_parents": [self.product1.pk],
            "suggested_parents": [self.product2.pk],
            "concrete_bundles": [
                {
                    "triggering_product": self.product1.pk,
                    "suggested_products": [self.product2.pk],
                },
            ],
            "user_configurable_bundles": [
                {
                    "triggering_product": self.product1.pk,
                    "suggested_range": self.rangeA.pk,
                    "quantity": 2,
                },
            ]
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        self.bundle_group1.refresh_from_db()
        self.assertEqual(self.bundle_group1.name, "test bundle 1")

        data = dict(resp.data)
        data['concrete_bundles'][0] = dict(data['concrete_bundles'][0])
        data['user_configurable_bundles'][0] = dict(data['user_configurable_bundles'][0])
        self.assertDictEqual(data, {
            "id": self.bundle_group1.pk,
            "bundle_type": "default",
            "name": "test bundle 1",
            "headline": "test headline",
            "description": "test description",
            "image": None,
            "triggering_parents": [self.product1.pk],
            "suggested_parents": [self.product2.pk],
            "concrete_bundles": [
                {
                    "id": self.bundle_group1.concrete_bundles.first().pk,
                    "triggering_product": self.product1.pk,
                    "suggested_products": [self.product2.pk],
                },
            ],
            "user_configurable_bundles": [
                {
                    "id": self.bundle_group1.user_configurable_bundles.first().pk,
                    "triggering_product": self.product1.pk,
                    "suggested_range": self.rangeA.pk,
                    "quantity": 2,
                },
            ]
        })
