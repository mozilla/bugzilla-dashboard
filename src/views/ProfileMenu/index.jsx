import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar, Button, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
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
      open: false,
    };

    handleToggle = () => {
      this.setState(state => ({ open: !state.open }));
    };

    handleClose = (event) => {
      if (this.anchorEl.contains(event.target)) {
        return;
      }

      this.setState({ open: false });
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
      const firstLetter = userSession.name[0];
      return (
        <Avatar className={classes.avatar}>
          {firstLetter}
        </Avatar>
      );
    };

    render() {
      const { classes, context, userSession } = this.props;
      const { open } = this.state;

      return (
        <div className={classes.root}>

          <Button
            buttonRef={(node) => {
              this.anchorEl = node;
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            {this.renderAvatar()}
          </Button>
          <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      <Typography variant="subtitle1" gutterBottom>
                        {userSession.name}
                      </Typography>
                      <MenuItem onClick={this.handleClose}>Profile - disable</MenuItem>
                      <MenuItem onClick={this.handleClose}>My account - disable</MenuItem>
                      <MenuItem onClick={() => context.setUserSession(null)}>Sign out</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>

        </div>
      );
    }
}

ProfileMenu.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(ProfileMenu);
