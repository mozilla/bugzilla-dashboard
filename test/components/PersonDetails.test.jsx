import React from 'react';
import renderer from 'react-test-renderer';
import PersonDetails from '../../src/components/PersonDetails';
import partialOrg from '../mocks/partialOrg';
import bugzillaComponents from '../mocks/bugzillaComponents';

it('renders the details for an individual contributor', () => {
  const person = partialOrg['someone@mozilla.com'];
  const components = Object.values(bugzillaComponents).filter(comp => (
    comp.bugzillaEmail === person.bugzillaEmail));
  const tree = renderer
    .create((
      <PersonDetails
        person={person}
        components={components}
        onGoBack={() => null}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the details for a manager', () => {
  const person = partialOrg['manager@mozilla.com'];
  const components = Object.values(bugzillaComponents).filter(comp => (
    comp.bugzillaEmail === person.bugzillaEmail));
  const tree = renderer
    .create((
      <PersonDetails
        person={person}
        components={components}
        onGoBack={() => null}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
