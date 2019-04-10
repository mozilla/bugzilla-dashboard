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
