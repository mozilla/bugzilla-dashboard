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

const sortByComponentName = (a, b) => a.label - b.label;

const BugzillaComponents = ({
  classes, title, bugzillaComponents, onComponentDetails,
}) => (
  bugzillaComponents.length > 0 && (
    <div>
      <h3 className={classes.header}>{title}</h3>
      <table>
        <thead>
          <tr>
            <th />
            {onComponentDetails && <th />}
            {Object.values(METRICS).map(({ label }) => (
              <th key={label} className={classes.metricLabel}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bugzillaComponents
            .sort(sortByComponentName)
            .map(({
              label, component, product, metrics = {}, teamKey = null,
            }) => (
              <tr key={label}>
                {onComponentDetails && (
                  <td>
                    <div
                      name={label}
                      onKeyPress={onComponentDetails}
                      onClick={onComponentDetails}
                      bzcomponentkey={teamKey || `${product}::${component}`}
                      teamkey={teamKey}
                      role="button"
                      tabIndex="0"
                    >
                      <ExpandMore
                        classes={{ root: classes.icon }}
                        bzcomponentkey={teamKey || `${product}::${component}`}
                        teamkey={teamKey}
                      />
                    </div>
                  </td>
                )}
                <td>{label}</td>
                {Object.keys(METRICS).map(metric => (
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
  title: PropTypes.string.isRequired,
  bugzillaComponents: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      product: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
      component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]).isRequired,
      metrics: PropTypes.shape({}),
    }),
  ).isRequired,
  onComponentDetails: PropTypes.func,
};

BugzillaComponents.defaultProps = {
  onComponentDetails: undefined,
};

export default withStyles(styles)(BugzillaComponents);
