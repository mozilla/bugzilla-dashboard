from rest_framework import serializers
from bug_mgmt.org.models import Person, Component, Category


class PersonLightSerializer(serializers.ModelSerializer):
    '''
    Get simple details for a person
    Used by others serializers
    '''
    class Meta:
        model = Person
        fields = (
            'id',
            'name',
            'email',
        )


class CategorySerializer(serializers.ModelSerializer):
    '''
    Get simple details for a category
    Used by others serializers
    '''
    class Meta:
        model = Category
        fields = (
            'id',
            'name',
        )


class ComponentLightSerializer(serializers.ModelSerializer):
    '''
    Get simple details for a component
    Used by others serializers
    '''
    category = CategorySerializer()
    owner = PersonLightSerializer()

    class Meta:
        model = Component
        fields = (
            'id',
            'category',
            'name',
            'owner',
        )


class PersonSerializer(serializers.ModelSerializer):
    '''
    Get details about a person, hierarchy & components
    '''
    manager = PersonLightSerializer()
    components = ComponentLightSerializer(many=True)

    class Meta:
        model = Person
        fields = (
            'id',
            'name',
            'title',
            'email',
            'bugzilla_email',
            'manager',
            'components',
        )
