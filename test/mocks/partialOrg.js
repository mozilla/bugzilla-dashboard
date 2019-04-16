const partialOrg = {
  'someone@mozilla.com': {
    bugzillaEmail: 'someone@mozilla.com',
    cn: 'Someone',
    mail: 'someone@mozilla.com',
    manager: {
      dn: 'mail=manager@mozilla.com,o=com,dc=mozilla',
    },
  },
  'manager@mozilla.com': {
    bugzillaEmail: 'someone@mozilla.com',
    cn: 'Manager',
    mail: 'manager@mozilla.com',
    manager: null,
  },
};

export default partialOrg;
