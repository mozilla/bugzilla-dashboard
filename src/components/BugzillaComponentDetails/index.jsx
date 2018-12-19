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
    gridTemplateColumns: '0.5fr 0.5fr',
  },
  metricLabel: {
    textTransform: 'capitalize',
  },
  metricLink: {
    textAlign: 'center',
  },
  content: {
    width: '100%',
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
      <BugzillaGraph
        label={`${product}::${component}`}
        queries={[
          {
            label: 'No priority',
            parameters: {
              product,
              component,
              ...METRICS.untriaged.parameters,
            },
          },
          {
            label: 'Needinfo',
            parameters: {
              product,
              component,
              ...METRICS.needinfo.parameters,
            },
          },
        ]}
      />
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
