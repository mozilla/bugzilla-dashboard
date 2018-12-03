from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from bug_mgmt.org.models import Person, Category
import json


class Command(BaseCommand):
    help = 'Load Bugzilla components from JSON file'

    def add_arguments(self, parser):
        parser.add_argument(
            'source',
            type=open,
        )

    def handle(self, *args, **options):
        try:
            source = json.load(options['source'])
        except Exception as e:
            raise CommandError('Invalid JSON file')

        for name, components in source.items():
            # Create category
            category, created = Category.objects.get_or_create(name=name)
            if created:
                print('Created category {}'.format(category))


            # Create components
            for name, owner in components.items():
                component, created = category.components.get_or_create(name=name)
                if created:
                    print('Created component {}'.format(component))

                if owner:
                    try:
                        person = Person.objects.get(Q(bugzilla_email=owner) | Q(email=owner))
                    except Person.DoesNotExist:
                        print('Missing {}'.format(owner))
                        continue
                    if person != component.owner:
                        component.owner = person
                        component.save()
                        print('{} owns {}'.format(person, component))
