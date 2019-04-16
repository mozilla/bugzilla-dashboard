import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BugzillaComponents from '../../components/BugzillaComponents';

const styles = {
  message: {
    margin: '0 0 1rem 0',
  },
};

const Teams = ({ classes, ...rest }) => (
  <React.Fragment>
    <div className={classes.message}>
      <span>If you want to change what shows up in this page follow </span>
      <a href="https://github.com/mozilla/bugzilla-dashboard#generate-data">these instructions</a>
    </div>
    <BugzillaComponents {...rest} />
  </React.Fragment>
);

Teams.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(Teams);
