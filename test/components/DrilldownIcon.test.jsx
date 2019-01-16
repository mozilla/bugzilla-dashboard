import React from 'react';
import renderer from 'react-test-renderer';
import DrilldownIcon from '../../src/components/DrilldownIcon';

it('renders the details for a Bugzilla component', () => {
  const tree = renderer
    .create((
      <DrilldownIcon
        name="x"
        properties={{ y: 'z' }}
        onChange={() => null}
      />
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
