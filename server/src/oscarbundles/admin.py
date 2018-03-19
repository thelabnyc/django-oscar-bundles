from django.contrib import admin
from .models import Bundle, BundleGroup


@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    pass


@admin.register(BundleGroup)
class BundleGroupAdmin(admin.ModelAdmin):
    pass
