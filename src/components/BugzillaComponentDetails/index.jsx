import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/Link';

import DetailView from '../DetailView';
import BugzillaGraph from '../../containers/BugzillaGraph';
import { BZ_QUERIES } from '../../config';

const styles = ({
  subtitle: {
    margin: '0 0 0.5rem',
    color: 'gray',
  },
  metric: {
    display: 'grid',
    gridTemplateColumns: '200px 20px',
  },
  metricCardGraphContainer: {
    display: 'flex',
    width: '100%',
  },
  metricHeader: {
    color: 'rgba(115, 115, 115, 0.87)',
    textAlign: 'center',
    fontSize: '1.2rem',
    margin: '4px 0 0 0',
    borderBottom: '1.3px solid #eee',
    padding: '4px 0',
  },
  metricContentContainer: {
    maxHeight: 190,
    overflow: 'scroll',
  },
  metricContainer: {
    padding: 0,
  },
  metricLabel: {
    textTransform: 'capitalize',
    flex: 10,
    fontSize: 12,
  },
  metricCounter: {
    flex: 1,
    fontSize: 12,
  },
  metricLink: {
    textAlign: 'right',
    padding: 0,
    flex: 0,
    borderRadius: '100%',
  },
  metricButton: {
    padding: 6,
  },
  graphs: {
    display: 'flex',
  },
  card: {
    minWidth: 275,
  },

});

const constructQuery = (metrics, product, component) => Object.values(metrics).map((metric) => {
  const { label, parameters } = metric;
  // We need all bugs regardless of their resolution in order to decrease/increase
  // the number of open bugs per date
  delete parameters.resolution;
  return {
    label,
    parameters: {
      product,
      component,
      ...parameters,
    },
  };
});

const ListItemLink = props => <ListItem button component="a" {...props} />;

const BugzillaComponentDetails = ({
  classes, bugzillaEmail, product, component, title, metrics = {}, onGoBack,
}) => (
  <DetailView title={title} onGoBack={onGoBack}>
    <div className={classes.metricCardGraphContainer}>
      {Object.keys(metrics).length
        ? (
          <Card className={classes.card}>
            {bugzillaEmail && <h4 className={classes.metricHeader}>{bugzillaEmail}</h4>}
            <CardContent className={classes.metricContentContainer}>
              <List aria-label="Main mailbox folders">
                {Object.keys(metrics).sort().map(metric => (
                  metrics[metric] && (
                  <ListItem className={classes.metricContainer} key={metric}>
                    <p className={classes.metricLabel}>{metric}</p>
                    <ListItemText
                      className={classes.metricCounter}
                      primary={metrics[metric].count}
                    />
                    <ListItemLink className={classes.metricLink} href={metrics[metric].link} target="_blank">
                      <IconButton edge="end" aria-label="Comments" className={classes.metricButton}>
                        <LinkIcon />
                      </IconButton>
                    </ListItemLink>
                  </ListItem>
                  )
                ))}
              </List>
            </CardContent>
          </Card>
        )
        : null
      }

      <BugzillaGraph
        queries={constructQuery(BZ_QUERIES, product, component)}
      />
    </div>
  </DetailView>
);

BugzillaComponentDetails.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  bugzillaEmail: PropTypes.string,
  product: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]).isRequired,
  component: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]).isRequired,
  metrics: PropTypes.shape({}),
  title: PropTypes.string.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

BugzillaComponentDetails.defaultProps = {
  bugzillaEmail: '',
  metrics: {},
};

export default withStyles(styles)(BugzillaComponentDetails);
