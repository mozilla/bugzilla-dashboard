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
  icon: {
    fontSize: '1rem',
    verticalAlign: 'bottom',
  },
  person: {
    // This makes it line up better with the table of components
    padding: '1px',
    display: 'flex',
  },
});

const sortByPersonName = (a, b) => a.cn.localeCompare(b.cn);

const Reportees = ({
  classes, ldapEmail, partialOrg,
}) => (
  <div className={classes.root}>
    <div height="1rem">&nbsp;</div>
    {Object.values(partialOrg)
      .filter(({ cn }) => cn !== ldapEmail)
      .sort(sortByPersonName)
      .map(({ cn, mail }) => (
        <div key={mail} className={classes.person}>
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
