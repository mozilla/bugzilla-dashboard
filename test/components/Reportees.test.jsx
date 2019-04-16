import React from 'react';
import renderer from 'react-test-renderer';
import Reportees from '../../src/components/Reportees';
import partialOrg from '../mocks/partialOrg';

it('renders Someone with no reportees', () => {
  const tree = renderer
    .create((
      <Reportees
        ldapEmail="someone@mozilla.com"
        partialOrg={partialOrg}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Manager who has reportees', () => {
  const tree = renderer
    .create((
      <Reportees
        ldapEmail="manager@mozilla.com"
        partialOrg={partialOrg}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Manager who has reportees & metrics', () => {
  const tree = renderer
    .create((
      <Reportees
        ldapEmail="manager@mozilla.com"
        partialOrg={partialOrg}
        metrics={{
          'someone@mozilla.com': {
            assigned: { count: 0, link: 'https://mozilla.org/0' },
            needinfo: { count: 1, link: 'https://mozilla.org/1' },
          },
          'manager@mozilla.com': {
            assigned: { count: 2, link: 'https://mozilla.org/2' },
            needinfo: { count: 3, link: 'https://mozilla.org/3' },
          },
        }}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
