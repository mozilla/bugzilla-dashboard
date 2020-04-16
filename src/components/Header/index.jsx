import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { NavLink } from 'react-router-dom';
import CredentialsMenu from '../../views/CredentialsMenu';

const styles = (theme) => ({
  styledToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    'min-height': theme.spacing.unit * 1,
  },
});

const Header = ({
  classes, selectedTabIndex, handleTabChange, userId,
}) => (
  <AppBar position="static">
    <Toolbar className={classes.styledToolbar}>
      <Tabs value={selectedTabIndex} onChange={handleTabChange}>
        <Tab label="Reportees" component={NavLink} to={`reportees?userId=${userId}`} />
        <Tab label="Components" component={NavLink} to={`components?userId=${userId}`} />
      </Tabs>
      <CredentialsMenu />
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.shape({
    styledToolbar: PropTypes.string.isRequired,
  }).isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default withStyles(styles)(Header);
