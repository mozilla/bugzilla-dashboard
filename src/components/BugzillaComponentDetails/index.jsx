import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import BugzillaGraph from '../../containers/BugzillaGraph';
import METRICS from '../../utils/bugzilla/metrics';

const styles = ({
  root: {},
  header: {
    display: 'flex',
  },
  title: {
    margin: '0',
  },
  subtitle: {
    margin: '0',
    color: 'gray',
  },
  content: {
    width: '100%',
  },
});

const linkToQuery = (key, metrics, alt) => (
  <a href={metrics[key].link} alt={alt}>{metrics[key].count}</a>
);

// TODO: Perhaps a CSS grid will align the back arrow and title better
// TODO: Receive the name of the person rather than the bugzilla email address
const BugzillaComponentDetails = ({
  classes, bugzillaEmail, product, component, metrics = {}, onGoBack,
}) => (
  <div className={classes.root}>
    <div className={classes.header}>
      {onGoBack && (
        <a href="/" onClick={onGoBack} rel="noopener noreferrer">
          <ArrowBack />
        </a>
      )}
      <div className={classes.content}>
        <h2 className={classes.title}>{`${product}::${component}`}</h2>
        <h4 className={classes.subtitle}>{bugzillaEmail}</h4>
        {Object.values(metrics).map(metric => (
          metrics[metric] && linkToQuery(metric, metrics, `Number of ${metric} bugs`)
        ))}
        <BugzillaGraph
          label={`${product}::${component}`}
          queries={[
            {
              label: 'No priority',
              parameters: {
                product,
                component,
                ...METRICS.untriaged,
              },
            },
          ]}
        />
      </div>
    </div>
  </div>
);

BugzillaComponentDetails.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  bugzillaEmail: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  metrics: PropTypes.shape({}),
  onGoBack: PropTypes.func,
};

BugzillaComponentDetails.defaultProps = {
  metrics: {},
  onGoBack: undefined,
};

export default withStyles(styles)(BugzillaComponentDetails);
