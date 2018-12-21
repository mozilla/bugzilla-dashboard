import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpandMore from '@material-ui/icons/ExpandMore';
import METRICS from '../../utils/bugzilla/metrics';

const styles = ({
  header: {
    margin: '0.5rem 0 0 0',
  },
  metric: {
    textAlign: 'center',
  },
  metricLabel: {
    textDecoration: 'underline',
  },
  icon: {
    fontSize: '1rem',
    verticalAlign: 'bottom',
  },
});

const sortByComponentName = (a, b) => {
  let result = (a.product <= b.product);
  if (a.product === b.product) {
    result = a.component <= b.component;
  }
  return result ? -1 : 1;
};

const BugzillaComponents = ({
  classes, bugzillaComponents, onComponentDetails,
}) => (
  Object.values(bugzillaComponents).length > 0 && (
    <div>
      <h3 className={classes.header}>Components</h3>
      <table>
        <thead>
          <tr>
            <th colSpan="2" />
            {Object.values(METRICS).map(({ label }) => (
              <th key={label} className={classes.metricLabel}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(bugzillaComponents)
            .sort(sortByComponentName)
            .map(({ component, product, metrics = {} }) => (
              <tr key={`${product}::${component}`}>
                {onComponentDetails && (
                  <td>
                    <div
                      name={`${product}::${component}`}
                      onKeyPress={onComponentDetails}
                      onClick={onComponentDetails}
                      product={product}
                      component={component}
                      role="button"
                      tabIndex="0"
                    >
                      <ExpandMore classes={{ root: classes.icon }} />
                    </div>
                  </td>
                )}
                <td>{`${product}::${component}`}</td>
                {Object.keys(metrics).map(metric => (
                  metrics[metric] && (
                  <td key={metric} className={classes.metric}>
                    <a href={metrics[metric].link}>{metrics[metric].count}</a>
                  </td>
                  )
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
);

BugzillaComponents.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  bugzillaComponents: PropTypes.shape({}).isRequired,
  onComponentDetails: PropTypes.func.isRequired,
};

export default withStyles(styles)(BugzillaComponents);
