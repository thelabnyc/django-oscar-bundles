from io import StringIO

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.test import override_settings
from oscar.test.factories import create_product
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from ..models import BundleGroup

PROJECT_TYPES = (
    ("upsell", "Upsell"),
    ("cross-sell", "Cross-sell"),
)


class BundleGroupTypesSettingTest(APITestCase):
    def assertNoPendingMigrations(self):
        out = StringIO()
        call_command("makemigrations", "--check", "--dry-run", stdout=out)
        self.assertIn("No changes detected", out.getvalue())

    def test_package_default_types(self):
        field = BundleGroup._meta.get_field("bundle_type")
        self.assertEqual(list(field.choices), [("default", "Default")])
        self.assertEqual(BundleGroup().bundle_type, "default")
        self.assertEqual(list(BundleGroup.GROUP_TYPE_OPTIONS), [("default", "Default")])

        resp = self.client.get(reverse("bundlegrouptype-list"))
        self.assertEqual(resp.data, [{"display_name": "Default", "value": "default"}])

        self.assertNoPendingMigrations()

    @override_settings(BUNDLE_GROUP_TYPES=PROJECT_TYPES)
    def test_project_types_need_no_migration(self):
        field = BundleGroup._meta.get_field("bundle_type")
        self.assertEqual(list(field.choices), list(PROJECT_TYPES))
        self.assertEqual(BundleGroup().bundle_type, "upsell")
        self.assertEqual(BundleGroup.GROUP_TYPE_OPTIONS, PROJECT_TYPES)
        self.assertEqual(BundleGroup().GROUP_TYPE_OPTIONS, PROJECT_TYPES)

        BundleGroup(bundle_type="cross-sell").full_clean()
        with self.assertRaises(ValidationError):
            BundleGroup(bundle_type="default").full_clean()

        resp = self.client.get(reverse("bundlegrouptype-list"))
        self.assertEqual(
            resp.data,
            [
                {"display_name": "Upsell", "value": "upsell"},
                {"display_name": "Cross-sell", "value": "cross-sell"},
            ],
        )

        self.assertNoPendingMigrations()

    @override_settings(BUNDLE_GROUP_TYPES=PROJECT_TYPES)
    def test_api_accepts_project_types(self):
        User.objects.create_user(
            username="root", password="root", is_staff=True, is_superuser=True
        )
        self.client.login(username="root", password="root")
        product = create_product()
        payload = {
            "name": "Accessories",
            "triggering_parents": [product.pk],
            "suggested_parents": [],
            "concrete_bundles": [],
            "user_configurable_bundles": [],
        }
        url = reverse("bundlegroup-list")

        resp = self.client.post(
            url, {**payload, "bundle_type": "cross-sell"}, format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["bundle_type"], "cross-sell")

        resp = self.client.post(
            url, {**payload, "bundle_type": "default"}, format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
