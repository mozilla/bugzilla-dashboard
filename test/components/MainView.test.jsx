import React from 'react';
import renderer from 'react-test-renderer';
import MainView from '../../src/components/MainView';
import partialOrg from '../mocks/partialOrg';
import bugzillaComponents from '../mocks/bugzillaComponents';
import teamsConfig from '../../src/teamsConfig';

it('renders Someone with no reportees', () => {
  const tree = renderer
    .create((
      <MainView
        ldapEmail="someone@mozilla.com"
        partialOrg={partialOrg}
        bugzillaComponents={bugzillaComponents}
        teams={{}}
        onComponentDetails={() => null}
        onPersonDetails={() => null}
        selectedTabIndex={0}
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
        teams={{}}
        onComponentDetails={() => null}
        onPersonDetails={() => null}
        selectedTabIndex={0}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders Manager who has reportees and teams', () => {
  const tree = renderer
    .create((
      <MainView
        ldapEmail="manager@mozilla.com"
        partialOrg={partialOrg}
        bugzillaComponents={bugzillaComponents}
        teams={Object.values(teamsConfig)}
        onComponentDetails={() => null}
        onPersonDetails={() => null}
        selectedTabIndex={0}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
