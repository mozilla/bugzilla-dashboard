from django.contrib import admin
from bug_mgmt.org.models import Person, Category, Component


class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'manager')
    list_filter = ('manager', )


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', )


class ComponentAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'owner')
    list_filter = ('category', )


admin.site.register(Person, PersonAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Component, ComponentAdmin)
