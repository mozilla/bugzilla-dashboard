import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DetailView from '../DetailView';

const styles = ({
  subtitle: {
    margin: '0 0 0.5rem',
    color: 'gray',
  },
  metric: {
    display: 'grid',
    gridTemplateColumns: '0.5fr 0.5fr',
  },
  metricLabel: {
    textTransform: 'capitalize',
  },
  metricLink: {
    textAlign: 'center',
  },
});

const BugzillaComponentDetails = ({
  classes, bugzillaEmail, product, component, metrics = {}, onGoBack,
}) => (
  <DetailView title={`${product}::${component}`} onGoBack={onGoBack}>
    <div>
      <h4 className={classes.subtitle}>{bugzillaEmail}</h4>
      {Object.keys(metrics).map(metric => (
        metrics[metric] && (
          <div key={metric} className={classes.metric}>
            <span className={classes.metricLabel}>{metric}</span>
            <a className={classes.metricLink} href={metrics[metric].link}>
              {metrics[metric].count}
            </a>
          </div>
        )
      ))}
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
