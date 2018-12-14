import React from 'react';
import PropTypes from 'prop-types';
import BugzillaComponent from '../BugzillaComponent';
import Reportees from '../Reportees';

const sortByComponentName = (a, b) => {
  let result = (a.product <= b.product);
  if (a.product === b.product) {
    result = a.component <= b.component;
  }
  return result ? -1 : 1;
};

const MainView = ({ ldapEmail, partialOrg, bugzillaComponents }) => (
  <div key={ldapEmail}>
    <h3>{partialOrg[ldapEmail].cn}</h3>
    <div style={{ display: 'flex' }}>
      <Reportees ldapEmail={ldapEmail} partialOrg={partialOrg} />
      {Object.values(bugzillaComponents).length > 0 && (
        <div>
          <h4>Components</h4>
            {Object.values(bugzillaComponents)
              .sort(sortByComponentName)
              .map(({ component, product, metrics }) => (
                <BugzillaComponent
                  key={`${product}::${component}`}
                  product={product}
                  component={component}
                  metrics={metrics}
                />
              ))}
        </div>
      )}
    </div>
  </div>
);

MainView.propTypes = {
  ldapEmail: PropTypes.string.isRequired,
  partialOrg: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.shape({}),
};

MainView.defaultProps = {
  bugzillaComponents: {},
};

export default MainView;
