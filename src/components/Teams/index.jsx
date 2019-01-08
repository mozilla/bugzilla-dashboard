import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = ({
  root: {
    margin: '0 0.5rem 0 0',
  },
  header: {
    margin: '0.5rem 0 0.5rem 0',
  },
});

const Teams = ({ classes, teams }) => (
  <div className={classes.root}>
    <h3 className={classes.header}>Teams</h3>
    <div height="1rem">&nbsp;</div>
    {teams.map(({ label }) => (
      <div key={label}>{label}</div>
    ))}
  </div>
);

Teams.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  teams: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default withStyles(styles)(Teams);
