import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DetailView from '../DetailView';
import BugzillaGraph from '../../containers/BugzillaGraph';
import METRICS from '../../utils/bugzilla/metrics';

const styles = ({
  subtitle: {
    margin: '0 0 0.5rem',
    color: 'gray',
  },
  metric: {
    display: 'grid',
    gridTemplateColumns: '100px 20px',
  },
  metricLabel: {
    textTransform: 'capitalize',
  },
  metricLink: {
    textAlign: 'right',
  },
  graphs: {
    display: 'flex',
  },
});

const constructQuery = (metric, product, component) => {
  const { label, parameters } = metric;
  // We need all bugs regardless of their resolution in order to decrease/increase
  // the number of open bugs per date
  delete parameters.resolution;
  return [{
    label,
    parameters: {
      product,
      component,
      ...parameters,
    },
  }];
};

const BugzillaComponentDetails = ({
  classes, bugzillaEmail, product, component, metrics = {}, onGoBack,
}) => (
  <DetailView title={`${product}::${component}`} onGoBack={onGoBack}>
    <div>
      <h4 className={classes.subtitle}>{bugzillaEmail}</h4>
      {Object.keys(metrics).sort().map(metric => (
        metrics[metric] && (
          <div key={metric} className={classes.metric}>
            <span className={classes.metricLabel}>{metric}</span>
            <a className={classes.metricLink} href={metrics[metric].link}>
              {metrics[metric].count}
            </a>
          </div>
        )
      ))}
      {/* Splitting the graphs out allows each metric to load without blocking on the rest */}
      <div className={classes.graphs}>
        {Object.keys(metrics).sort().map(metric => (
          <BugzillaGraph
            key={metric}
            label={`${product}::${component}`}
            queries={constructQuery(METRICS[metric], product, component)}
          />
        ))}
      </div>

    </div>
  </DetailView>

);

BugzillaComponentDetails.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  bugzillaEmail: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
  metrics: PropTypes.shape({}),
  onGoBack: PropTypes.func.isRequired,
};

BugzillaComponentDetails.defaultProps = {
  metrics: {},
};

export default withStyles(styles)(BugzillaComponentDetails);
