from django.db import models


# Note: works on sqlite, not tested on Postgresql
MANAGED_CTE_QUERY = '''
WITH RECURSIVE
  managed_by(id) AS (
    values({0})
    UNION
    select p.id
    from org_person as p, managed_by
    where p.manager_id=managed_by.id
  )
SELECT * FROM org_person as p
 WHERE p.id IN managed_by AND p.id != {0};
'''

class Person(models.Model):
    '''
    Someone in the Mozilla organisation
    '''
    email = models.EmailField(unique=True)
    bugzilla_email = models.EmailField(null=True, blank=True)
    name = models.CharField(max_length=250)
    title = models.CharField(max_length=250, null=True, blank=True)

    manager = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        related_name='directs',
        on_delete=models.SET_NULL,
    )

    class Meta:
        ordering = ('name', )

    def __str__(self):
        return self.name

    def list_managed(self):
        '''
        List recursively all the managed people under this person
        '''
        if not self.directs.exists():
            return Person.objects.none()

        return Person.objects.raw(MANAGED_CTE_QUERY.format(self.id))

    def list_all_components(self):
        '''
        List all components managed by this person & all his subordinates
        '''
        return Component.objects.filter(
            owner__in=self.list_managed(),
        )


class Category(models.Model):
    '''
    A Bugzilla component category
    '''
    name = models.CharField(unique=True, max_length=250)

    class Meta:
        ordering = ('name', )

    def __str__(self):
        return self.name


class Component(models.Model):
    '''
    A Bugzilla component
    '''
    category = models.ForeignKey(
        Category,
        related_name='components',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=250)
    owner = models.ForeignKey(
        Person,
        related_name='components',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ('category', 'name', )

    def __str__(self):
        return '{} - {}'.format(self.category, self.name)
