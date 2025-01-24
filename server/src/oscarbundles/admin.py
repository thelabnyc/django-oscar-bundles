from django.contrib import admin

from .models import BundleGroup, ConcreteBundle, UserConfigurableBundle


@admin.register(BundleGroup)
class BundleGroupAdmin(admin.ModelAdmin[BundleGroup]):
    pass


@admin.register(ConcreteBundle)
class BundleAdmin(admin.ModelAdmin[ConcreteBundle]):
    pass


@admin.register(UserConfigurableBundle)
class UserConfigurableBundleAdmin(admin.ModelAdmin[UserConfigurableBundle]):
    pass
