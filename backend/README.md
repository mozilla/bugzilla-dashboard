# Django Backend for Bug Management Dashboard

## Setup

```
mkvirtualenv -p /usr/bin/python3 bug_mgmt
pip install -r requirements.txt
```

## Initial data

From Calixte's scrapped data

```
./manage.py import_org path/to/people.json
./manage.py import_components path/to/triage_owners.json
```
