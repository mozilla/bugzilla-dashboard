from django.contrib import admin
from bug_mgmt.org.models import Person


class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'manager')


admin.site.register(Person, PersonAdmin)
