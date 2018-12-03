from rest_framework.generics import RetrieveAPIView
from bug_mgmt.org.models import Person
from bug_mgmt.org.serializers import PersonSerializer


class PersonDetails(RetrieveAPIView):
    '''
    Get details for a person
    '''
    queryset = Person.objects.all()
    lookup_field = 'email'
    serializer_class = PersonSerializer
