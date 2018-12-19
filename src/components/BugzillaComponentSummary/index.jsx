import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = ({
  metric: {
    textAlign: 'center',
  },
});

const linkToQuery = (key, metrics) => (
  <a href={metrics[key].link}>{metrics[key].count}</a>
);

const BugzillaComponentSummary = ({
  classes, product, component, metrics, onComponentDrilldown,
}) => (
  <tr>
    <td>{`${product}::${component}`}</td>
    {Object.keys(metrics).map(metric => (
      metrics[metric] && (
        <td key={metric} className={classes.metric}>
          {linkToQuery(metric, metrics)}
        </td>
      )
    ))}
    {onComponentDrilldown && (
      <td>
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
      </td>
    )}
  </tr>
);

BugzillaComponentSummary.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  product: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  metrics: PropTypes.shape({}),
  onComponentDrilldown: PropTypes.func,
};

BugzillaComponentSummary.defaultProps = {
  metrics: {},
  onComponentDrilldown: undefined,
};

export default withStyles(styles)(BugzillaComponentSummary);
