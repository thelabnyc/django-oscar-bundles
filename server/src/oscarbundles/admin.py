from django.contrib import admin
from .models import ConcreteBundle, BundleGroup, UserConfigurableBundle


@admin.register(BundleGroup)
class BundleGroupAdmin(admin.ModelAdmin):
    pass


@admin.register(ConcreteBundle)
class BundleAdmin(admin.ModelAdmin):
    pass


@admin.register(UserConfigurableBundle)
class UserConfigurableBundleAdmin(admin.ModelAdmin):
    pass
