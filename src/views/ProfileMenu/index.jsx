import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
  Avatar, IconButton, Menu, MenuItem, Typography,
} from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  grow: {
    marginRight: theme.spacing.unit * 15,
  },
  avatar: {
    width: 25,
    height: 25,
    marginRight: theme.spacing.unit * 15,
  },
});

class ProfileMenu extends React.Component {
    state = {
      anchorEl: null,
    };

    handleMenu = (event) => {
      this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
      this.setState({ anchorEl: null });
    };

    renderAvatar = () => {
      const { classes, userSession } = this.props;
      if (userSession.picture) {
        return (
          <Avatar
            alt={userSession.name}
            src={userSession.picture}
            className={classes.avatar}
          />
        );
      }
      return (
        <AccountCircle className={classes.avatar} />
      );
    };

    render() {
      const { classes, context, userSession } = this.props;
      const { anchorEl } = this.state;
      const open = Boolean(anchorEl);

      return (
        <div className={classes.root}>

          <div>
            <IconButton
              aria-owns={open ? 'menu-appbar' : undefined}
              aria-haspopup="true"
              onClick={this.handleMenu}
              color="inherit"
            >
              {this.renderAvatar()}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={this.handleClose}
            >
              <Typography variant="subtitle1">
                {userSession.name}
              </Typography>
              <MenuItem onClick={() => context.setUserSession(null)}>Sign out</MenuItem>
            </Menu>
          </div>
        </div>
      );
    }
}

ProfileMenu.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  userSession: PropTypes.shape({}).isRequired,
  context: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ProfileMenu);
