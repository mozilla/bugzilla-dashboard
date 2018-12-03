from django.db import models


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
