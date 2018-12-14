import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BugzillaComponentSummary from '../BugzillaComponentSummary';
import Reportees from '../Reportees';

const styles = ({
  header: {
    margin: '0.5rem 0 0.5rem 0',
  },
});

const sortByComponentName = (a, b) => {
  let result = (a.product <= b.product);
  if (a.product === b.product) {
    result = a.component <= b.component;
  }
  return result ? -1 : 1;
};

const MainView = ({
  classes, ldapEmail, partialOrg, bugzillaComponents, onComponentDrilldown,
}) => (
  <div key={ldapEmail}>
    <h3 className={classes.header}>{partialOrg[ldapEmail].cn}</h3>
    <div style={{ display: 'flex' }}>
      <Reportees ldapEmail={ldapEmail} partialOrg={partialOrg} />
      {Object.values(bugzillaComponents).length > 0 && (
        <div>
          <h4 className={classes.header}>Components</h4>
            {Object.values(bugzillaComponents)
              .sort(sortByComponentName)
              .map(({ component, product, metrics }) => (
                <div
                  key={`${product}::${component}`}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <BugzillaComponentSummary
                    product={product}
                    component={component}
                    metrics={metrics}
                  />
                  {onComponentDrilldown && (
                    <button
                      name={`${product}::${component}`}
                      value={{ product, component }}
                      product={product}
                      component={component}
                      onClick={onComponentDrilldown}
                      type="button"
                    >
                      Details
                    </button>
                  )}
                </div>
              ))}
        </div>
      )}
    </div>
  </div>
);

MainView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  ldapEmail: PropTypes.string.isRequired,
  partialOrg: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.shape({}),
  onComponentDrilldown: PropTypes.func,
};

MainView.defaultProps = {
  bugzillaComponents: {},
  onComponentDrilldown: undefined,
};

export default withStyles(styles)(MainView);
