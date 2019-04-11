import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../../src/components/Header';

it('renders the reportees tab', () => {
  const tree = renderer
    .create((
      <Router>
        <Header
          selectedTabIndex={0}
          handleTabChange={() => null}
        />
      </Router>
    ))
    .toJSON();
  expect(tree).toMatchSnapshot();
});
