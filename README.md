# bugzilla-dashboard
This is a bugzilla dashboard that helps management determine Bugzilla components triaging status. Making it temporarily a private repository since there could be a chance I spill confidential information.

# Generate files
Until we have a backend, we need to regenerate certain files (e.g. triageOwners.json).
This file is checked-in because it makes the app snapier, however, it can fall out of date.

To regenerate it run this:
```
node scripts/generateTriageOwners.js
```