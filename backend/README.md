# Django Backend for Bug Management Dashboard

## Setup

```
cd backend
python3 -m venv bug_mgmt
pip install -r requirements.txt
source ./bug_mgmt/bin/activate
./manage.py migrate
```

## Start server
```
python manage.py runserver
```

## Initial data

From Calixte's scrapped data

```
./manage.py import_org path/to/people.json
./manage.py import_components path/to/triage_owners.json
```
