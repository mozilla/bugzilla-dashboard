import React from 'react';
import renderer from 'react-test-renderer';
import BugzillaComponents from '../../src/components/BugzillaComponents';
import bugzillaComponents from '../mocks/bugzillaComponents';
import { TEAMS_CONFIG } from '../../src/config';

it('renders components', () => {
  const tree = renderer
    .create((
      <BugzillaComponents
        bugzillaComponents={bugzillaComponents}
        onComponentDetails={() => null}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders components bucketed as teams', () => {
  const tree = renderer
    .create((
      <BugzillaComponents
        bugzillaComponents={Object.values(TEAMS_CONFIG)}
        onComponentDetails={() => null}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
