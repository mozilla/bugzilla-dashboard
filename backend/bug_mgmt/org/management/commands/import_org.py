from django.core.management.base import BaseCommand, CommandError
from bug_mgmt.org.models import Person
import json
import re


DN_EMAIL = re.compile(r'^mail=(.*),o=')


class Command(BaseCommand):
    help = 'Load organisation hierarchy from JSON file'

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

        # Create all person from files
        for person in source:

            person, created = Person.objects.get_or_create(
                email=person['mail'],
                defaults={
                    'bugzilla_email': person.get('bugzillaEmail'),
                    'name': person['cn'],
                    'title': person.get('title'),
                }
            )
            if created:
                print('Created {}'.format(person))

        # Set all manager links
        for person in source:
            if person.get('manager') is None:
                continue

            manager_mail = DN_EMAIL.search(person['manager']['dn'])
            if manager_mail is None:
                continue

            manager = Person.objects.get(email=manager_mail.group(1))
            person = Person.objects.get(email=person['mail'])
            if person.manager != manager:
                person.manager = manager
                person.save()
                print('Linked {} to {}'.format(person, manager))
