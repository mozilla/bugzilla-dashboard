from bug_mgmt.api.views import PersonDetails
from django.urls import path


urlpatterns = [
    path('person/<email>', PersonDetails.as_view(), name='person')
]
