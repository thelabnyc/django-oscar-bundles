from collections.abc import Sequence

from django.conf import settings
from django.db import models
from django.db.models import QuerySet
from django.utils.functional import classproperty
from django.utils.translation import gettext_lazy as _
from django_stubs_ext import StrOrPromise
from django_stubs_ext.db.models import TypedModelMeta
from oscar.apps.catalogue.abstract_models import AbstractProduct
from oscar.core.loading import get_model

Product = get_model("catalogue", "Product")


def get_bundle_group_types() -> Sequence[tuple[str, StrOrPromise]]:
    """
    Return the bundle group types a project allows, from the
    ``BUNDLE_GROUP_TYPES`` setting.

    The field takes this function, not its result, so that migrations record a
    reference to it rather than one project's list of types. Projects can then
    change the setting without generating a migration inside this package.
    """
    types: Sequence[tuple[str, StrOrPromise]] = getattr(
        settings,
        "BUNDLE_GROUP_TYPES",
        (
            # Translators: Bundle Group Name
            ("default", _("Default")),
        ),
    )
    return types


def get_default_bundle_group_type() -> str:
    return get_bundle_group_types()[0][0]


class BundleGroup(models.Model):
    @classproperty
    def GROUP_TYPE_OPTIONS(cls) -> Sequence[tuple[str, StrOrPromise]]:
        """Kept for code written against earlier releases; prefer
        ``get_bundle_group_types()``."""
        return get_bundle_group_types()

    bundle_type = models.CharField(
        _("Bundle Type"),
        max_length=200,
        default=get_default_bundle_group_type,
        choices=get_bundle_group_types,
    )

    name = models.CharField(_("Name"), max_length=200, blank=True, default="")
    is_active = models.BooleanField(_("Is Active"), default=True)

    headline = models.TextField(
        _("Headline"),
        blank=True,
        default=_("Forget Something?"),
        help_text=_("CTA headline in cart display"),
    )
    description = models.TextField(_("Description"), blank=True, default="")
    image = models.ImageField(
        upload_to=settings.OSCAR_IMAGE_FOLDER, max_length=255, blank=True, null=True
    )

    triggering_parents: models.ManyToManyField[AbstractProduct, models.Model] = (
        models.ManyToManyField(
            Product,
            related_name="triggering_bundle_groups",
            verbose_name=_("Triggering Products"),
        )
    )
    suggested_parents: models.ManyToManyField[AbstractProduct, models.Model] = (
        models.ManyToManyField(
            Product,
            related_name="suggesting_bundle_groups",
            verbose_name=_("Suggested Products"),
            blank=True,
        )
    )

    class Meta(TypedModelMeta):
        verbose_name = _("Bundle Group")
        verbose_name_plural = _("Bundle Groups")

    class ActiveModelManager(models.Manager["BundleGroup"]):
        def active(self) -> QuerySet["BundleGroup"]:
            return self.filter(is_active=True)

    objects = ActiveModelManager()


class ConcreteBundle(models.Model):
    bundle_group = models.ForeignKey(
        BundleGroup, on_delete=models.CASCADE, related_name="concrete_bundles"
    )

    triggering_product = models.ForeignKey(
        "catalogue.Product",
        on_delete=models.CASCADE,
        related_name="triggering_concrete_bundles",
        verbose_name=_("Triggering Product"),
        help_text=_("Which product should trigger this bundle?"),
    )
    suggested_products = models.ManyToManyField(
        "catalogue.Product",
        related_name="suggesting_bundles",
        verbose_name=_("Suggested Products"),
        help_text=_("Which product(s) should this bundle suggest when triggered?"),
    )

    class Meta(TypedModelMeta):
        verbose_name = _("Concrete Bundle")
        verbose_name_plural = _("Concrete Bundles")
        unique_together = (("bundle_group", "triggering_product"),)


class UserConfigurableBundle(models.Model):
    bundle_group = models.ForeignKey(
        BundleGroup, on_delete=models.CASCADE, related_name="user_configurable_bundles"
    )

    triggering_product = models.ForeignKey(
        "catalogue.Product",
        on_delete=models.CASCADE,
        related_name="triggering_user_configurable_bundles",
        verbose_name=_("Triggering Product"),
        help_text=_("Which product should trigger this bundle?"),
    )
    suggested_range = models.ForeignKey(
        "offer.Range",
        on_delete=models.CASCADE,
        related_name="suggesting_bundles",
        verbose_name=_("Suggested Ranges"),
        help_text=_("Which range(s) should this bundle suggest when triggered?"),
    )
    quantity = models.PositiveIntegerField(
        _("Quantity"),
        default=1,
        help_text=_("How many products from the range should be suggested?"),
    )

    class Meta(TypedModelMeta):
        verbose_name = _("User Configurable Bundle")
        verbose_name_plural = _("User Configurable Bundles")
        unique_together = (("bundle_group", "triggering_product", "suggested_range"),)
