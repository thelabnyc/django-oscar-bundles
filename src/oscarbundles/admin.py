from django.contrib import admin
from .models import Bundle, BundleGroup


@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    pass


class BundleInline(admin.StackedInline):
    model = Bundle
    extra = 0
    fields = ['name', 'description', 'image']


@admin.register(BundleGroup)
class BundleGroupAdmin(admin.ModelAdmin):
    inlines = [
        BundleInline,
    ]
