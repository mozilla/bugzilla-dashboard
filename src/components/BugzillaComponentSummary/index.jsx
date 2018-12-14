import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: '1',
    margin: '0 1rem 0 0',
  },
  componentText: {
    margin: '0 1rem 0 0',
  },
});

const linkToQuery = (key, metrics, alt) => (
  <a href={metrics[key].link} alt={alt}>{metrics[key].count}</a>
);

const BugzillaComponentSummary = ({
  classes, product, component, metrics,
}) => (
  <div className={classes.root}>
    <span className={classes.componentText}>{`${product}::${component}`}</span>
    {metrics.untriaged
      && linkToQuery('untriaged', metrics, 'Number of untriaged bugs')
    }
  </div>
);

BugzillaComponentSummary.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  product: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  metrics: PropTypes.shape({}),
};

BugzillaComponentSummary.defaultProps = {
  metrics: {},
};

export default withStyles(styles)(BugzillaComponentSummary);
