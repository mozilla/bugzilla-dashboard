# The Bugzilla management dashboard

This is a Bugzilla dashboard that helps management determine Bugzilla components triaging status plus listing members of their reporting chain.

Only LDAP users are allowed to use this app.

You can see the deployment in [here](http://bugzilla-management-dashboard.netlify.com/).

## Generate data

Until we have a backend, we need to regenerate certain files to bring the app up-to-date.

### Org related data

The data is stored in Taskcluster Secrets and it's only accessible to moco_team. See [bug 1540823](https://bugzilla.mozilla.org/show_bug.cgi?id=1540823)

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

## Contribute

If you don't have LDAP access you can start the app with `yarn start:alternativeAuth` and use Google or GitHub to authenticate. This will
not give you access to a functioning app, however, it will allow you to make contributions to the authenticated interface.

Issue #66 will add fake data into this alternative auth approach.

## Auth info

This app authenticates with Mozilla's official [Auth0 domain](https://auth.mozilla.auth0.com).
It uses SSO and it only allows authentication of Mozilla staff via LDAP.

The authentication configuration has the following characteristics:

* There are two different Auth0 clients
  * An official one (SSO + LDAP) and the other for non-LDAP contributors
  * Non-LDAP users will receive fake org data
* After a user authenticates, the auth will also authenticate with Taskcluster (`login.taskcluster.net`)
  * This is in order to later fetch a Taskcluster secret (only available to LDAP users)
