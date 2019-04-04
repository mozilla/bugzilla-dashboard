import json
import argparse

parser = argparse.ArgumentParser(
  description='Process Phonebook file and prepares it for TaskCluster Secret.'
)
parser.add_argument('--path', type=str, dest='phonebook_file', action='store',
                    help='Path to Phonebook file', required='true')
args = parser.parse_args()

with open(args.phonebook_file) as jsonfile:
    parsed = json.load(jsonfile)

newJson = {
  'employees': []
}
for entry in parsed:
  newJson['employees'].append({ key: entry.get(key) for key in ['cn', 'mail', 'bugzillaEmail', 'manager'] })

print json.dumps(newJson, indent=2, sort_keys=True)
