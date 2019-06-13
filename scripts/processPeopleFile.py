import json
import argparse

import yaml

parser = argparse.ArgumentParser(
  description='Process Phonebook file and prepares it for TaskCluster Secret.'
)
parser.add_argument('--path', type=str, dest='phonebook_file', action='store',
                    help='Path to Phonebook file', required='true')
args = parser.parse_args()

with open(args.phonebook_file) as jsonfile:
    parsed = json.load(jsonfile)

reducedOrgData = {
  'employees': []
}
for entry in parsed:
  reducedOrgData['employees'].append({ key: entry.get(key) for key in ['cn', 'mail', 'bugzillaEmail', 'manager'] })

with open('orgData.yml', 'w') as fh:
  yaml.safe_dump(reducedOrgData, fh)

print('The file orgData.yml has been generated. You can now upload it to Taskcluster Secrets if you wish to')
