import React from 'react';
import renderer from 'react-test-renderer';
import BugzillaComponentDetails from '../../src/components/BugzillaComponentDetails';
import bugzillaComponents from '../mocks/bugzillaComponents';

it('renders the details for a Bugzilla component', () => {
  /* eslint-disable react/jsx-props-no-spreading */
  const tree = renderer
    .create((
      <BugzillaComponentDetails
        {...bugzillaComponents[0]}
        title="Hello world!"
        onGoBack={() => null}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
