import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
  Avatar, IconButton, Menu, MenuItem,
} from '@material-ui/core';
import AuthContext from '../../components/auth/AuthContext';

const styles = ({
  avatar: {
    width: 25,
    height: 25,
  },
});

class ProfileMenu extends React.Component {
    static contextType = AuthContext;

    state = {
      anchorEl: null,
    };

    handleMenu = (event) => {
      this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
      this.setState({ anchorEl: null });
    };

    renderAvatar = (userSession) => {
      const { classes } = this.props;
      return userSession.picture ? (
        <Avatar
          alt={userSession.name}
          src={userSession.picture}
          className={classes.avatar}
        />
      ) : (
        <AccountCircle className={classes.avatar} />
      );
    };

    render() {
      const { context } = this;
      const { classes } = this.props;
      const userSession = context && context.getUserSession();
      const { anchorEl } = this.state;
      const open = Boolean(anchorEl);

      return (
        <div>
          <IconButton
            aria-owns={open ? 'menu-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleMenu}
            color="inherit"
          >
            {this.renderAvatar(userSession, classes)}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem>{userSession.name}</MenuItem>
            <MenuItem onClick={() => context.setUserSession(null)}>Sign out</MenuItem>
          </Menu>
        </div>
      );
    }
}

ProfileMenu.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ProfileMenu);
