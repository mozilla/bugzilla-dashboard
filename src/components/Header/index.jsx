import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CredentialsMenu from '../../views/CredentialsMenu';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  grow: {
    flexGrow: 1,
  },
  styledToolbar: {
    'min-height': 48,
  },
  navLink: {
    color: 'white',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    textDecoration: 'unset',
  },
});

const Header = ({ classes, showTabs }) => (
  <AppBar position="static">
    <Toolbar className={classes.styledToolbar}>
      {showTabs && (
        <div>
          <NavLink className={classes.navLink} to="/reportees">Reportees</NavLink>
          <NavLink className={classes.navLink} to="/teams">Teams</NavLink>
          <NavLink className={classes.navLink} to="/components">Components</NavLink>
        </div>
      )}
      <div className={classes.grow} />
      <CredentialsMenu />
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  showTabs: PropTypes.bool.isRequired,
  // selectedTabIndex: PropTypes.number.isRequired,
  // handleTabChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);
