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

const sortByPersonName = (a, b) => (a.cn <= b.cn ? -1 : 1);

const Reportees = ({ classes, ldapEmail, partialOrg }) => (
  <div className={classes.root}>
    <h4 className={classes.header}>Reportees</h4>
    {Object.values(partialOrg)
      .filter(({ cn }) => cn !== ldapEmail)
      .sort(sortByPersonName)
      .map(({ cn, mail }) => (
        <div key={mail}>
          <span>{`${cn} `}</span>
        </div>
      ))}
  </div>
);

Reportees.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  ldapEmail: PropTypes.string.isRequired,
  partialOrg: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Reportees);
