import React from 'react';
import renderer from 'react-test-renderer';
import MainView from '../../src/components/MainView';
import partialOrg from '../mocks/partialOrg';
import bugzillaComponents from '../mocks/bugzillaComponents';

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
