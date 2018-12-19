import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BugzillaComponentSummary from '../BugzillaComponentSummary';
import Reportees from '../Reportees';
import METRICS from '../../utils/bugzilla/metrics';

const styles = ({
  content: {
    display: 'flex',
  },
  header: {
    margin: '0.5rem 0 0 0',
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
    <h2 className={classes.header}>{partialOrg[ldapEmail].cn}</h2>
    <div className={classes.content}>
      <Reportees ldapEmail={ldapEmail} partialOrg={partialOrg} />
      {Object.values(bugzillaComponents).length > 0 && (
        <div>
          <h3 className={classes.header}>Components</h3>
          <table>
            <thead>
              <tr>
                <th />
                {Object.values(METRICS).map(({ label }) => <th key={label}>{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.values(bugzillaComponents)
                .sort(sortByComponentName)
                .map(({ component, product, metrics }) => (
                  <BugzillaComponentSummary
                    key={`${product}::${component}`}
                    product={product}
                    component={component}
                    metrics={metrics}
                    onComponentDrilldown={onComponentDrilldown}
                  />
                ))}
            </tbody>
          </table>
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
