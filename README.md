# The Bugzilla management dashboard

This is a Bugzilla dashboard that helps management determine Bugzilla components triaging status plus listing members of their reporting chain.

Only LDAP users are allowed to use this app. You can do development locally without an LDAP account, however, the app will only
have fake org data. See the [Contribute](#contribute) section.

You can see the deployment in our [Netlify instance](http://bugzilla-management-dashboard.netlify.com/).

## Adding more teams

A team is a collection of components that can span various products and it is shown under the Teams tab.
You can add new teams and make them show in the Teams tab by making changes to the [config](https://github.com/mozilla/bugzilla-dashboard/blob/master/src/config.js) file.

To add a team you need to modify `TEAMS_CONFIG` and an entry similar to this:

```javascript
export const TEAMS_CONFIG = {
  domCore: {
    label: 'DOM Core',
    owner: 'someone@mozilla.com',
    product: ['Core'],
    component: [
      'DOM: Core & HTML', 'DOM: Events',
      'Editor', 'HTML: Parser', 'Selection', 'Serializers',
      'User events and focus handling',
    ],
},
```

Here's how to configure it:

* `product` and `component` are parameters passed to the Bugzilla queries.
* `owner` should match someone reporting to you.
  * Use their Bugzilla email rather than their LDAP
  * If the person does is not someone showing up on your Reportees tab it won't work
* `label` is the name of the team

## Generate data

Until we have a backend, we need to regenerate certain files to bring the app up-to-date.

### Org related data

The data is stored in Taskcluster Secrets and it's only accessible to moco_team. See [bug 1540823](https://bugzilla.mozilla.org/show_bug.cgi?id=1540823)

To update the data you will need to take a Phonebook dump, get it reduced and converted to Yaml and upload it to Taskcluster Secrets.

Requirements:

* Python
* pip (which comes with Python) or [poetry](https://poetry.eustace.io/docs/#installation)

Set up the virtualenv with `poetry`:

```bash
poetry install
poetry shell
```

or:

```bash
python3 -m venv venv
source ./venv/bin/activate
pip install PyYaml
```

Execute the command:

```bash
python scripts/processPeopleFile.py --path /path/to/phonebook.json
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

## Running & tests

* [Install Yarn](https://yarnpkg.com/lang/en/docs/install/)

* To install the dependencies:

```bash
yarn install
```

* To run the tests:

```bash
yarn test -u
```

* To run the linting tests

```bash
yarn lint
```

* To run the project

```bash
yarn install
yarn start
```
