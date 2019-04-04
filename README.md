# The Bugzilla management dashboard

This is a Bugzilla dashboard that helps management determine Bugzilla components triaging status plus listing members of their reporting chain.

Only LDAP users are allowed to use this app.

You can see the deployment in [here](http://bugzilla-management-dashboard.netlify.com/).

## Generate data

Until we have a backend, we need to regenerate certain files to bring the app up-to-date.

### Org related data

The data is stored in TaskCluster Secrets and it's only accessible to moco_team. See [bug 1540823](https://bugzilla.mozilla.org/show_bug.cgi?id=1540823)

```bash
python scripts/processPeopleFile.py --path /path/to/phonebook.json > /path/to/smaller_file.json
```

You can read in [here](https://github.com/mozilla-iam/cis/issues/402) what changes are needed to get data from CIS.

### triageOwners.json

This file is checked-in because it makes the app snapier, however, it can fall out of date.

To regenerate it run this and commit the updated file:

```bash
node scripts/generateTriageOwners.js
```