import React from 'react';
import PropTypes from 'prop-types';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { withStyles } from '@material-ui/core/styles';
import getBugzillaComponentLink from '../../utils/getBugzillaComponentLink';

const styles = theme => ({
  root: {
    color: theme.palette.text.primary,
  },
  icon: {
    margin: 0,
    fontSize: '1rem',
  },
});

const BugzillaComponentSummary = ({ classes, product, component }) => (
  <div className={classes.root}>
    <span>{`${product}::${component}`}</span>
    <a href={getBugzillaComponentLink(product, component)} target="_blank" rel="noopener noreferrer">
      <OpenInNew className={classes.icon} />
    </a>
  </div>
);

BugzillaComponentSummary.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  product: PropTypes.string.isRequired,
  component: PropTypes.string.isRequired,
};

export default withStyles(styles)(BugzillaComponentSummary);
