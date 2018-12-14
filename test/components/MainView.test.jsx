import React from 'react';
import renderer from 'react-test-renderer';
import MainView from '../../src/components/MainView';

const partialOrg = {
  'someone@mozilla.com': {
    cn: 'Someone',
    mail: 'someone@mozilla.com',
    manager: {
      dn: 'mail=manager@mozilla.com,o=com,dc=mozilla',
    },
  },
  'manager@mozilla.com': {
    cn: 'Manager',
    mail: 'manager@mozilla.com',
    manager: null,
  },
};
const bugzillaComponents = {
  'Core::DOM: IndexedDB': {
    bugzillaEmail: 'someone@mozilla.com',
    component: 'DOM: IndexedDB',
    product: 'Core',
  },
  'Core::JavaScript Engine': {
    bugzillaEmail: 'someone@mozilla.com',
    component: 'JavaScript Engine',
    product: 'Core',
  },
  'Core::DOM: Core & HTML': {
    bugzillaEmail: 'someone@mozilla.com',
    component: 'DOM: Core & HTML',
    product: 'Core',
    metrics: {
      untriaged: {
        count: 944,
        link: 'https://bugzilla.mozilla.org/buglist.cgi?component=DOM%3A%20Core%20%26%20HTML&f1=bug_severity&f2=keywords&f3=resolution&limit=0&o1=notequals&o2=notsubstring&o3=isempty&product=Core&v1=enhancement&v2=meta',
      },
    },
  },
  'Toolkit::Async Tooling': {
    bugzillaEmail: 'manager@mozilla.com',
    component: 'Async Tooling',
    product: 'Toolkit',
  },
};

it('renders Someone with no reportees', () => {
  const tree = renderer
    .create((
      <MainView
        ldapEmail="someone@mozilla.com"
        partialOrg={partialOrg}
        bugzillaComponents={bugzillaComponents}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Manager who has reportees', () => {
  const tree = renderer
    .create((
      <MainView
        ldapEmail="manager@mozilla.com"
        partialOrg={partialOrg}
        bugzillaComponents={bugzillaComponents}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
