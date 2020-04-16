import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import AuthContext from '../../components/auth/AuthContext';
import ProfileMenu from '../ProfileMenu';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class CredentialsMenu extends React.PureComponent {
  static handleLoginRequest() {
    const loginView = new URL('/login', window.location);
    window.open(loginView, '_blank');
  }

  componentDidMount() {
    const { context } = this;
    if (context) {
      context.on(
        'user-session-changed',
        this.handleUserSessionChanged,
      );
    }
  }

  componentWillUnmount() {
    const { context } = this.context;
    if (context) {
      context.off(
        'user-session-changed',
        this.handleUserSessionChanged,
      );
    }
  }

  handleUserSessionChanged = () => {
    this.forceUpdate();
  };

  render() {
    // note: an update to the userSession will cause a forceUpdate
    const { context } = this;
    const { classes } = this.props;
    const userSession = context && context.getUserSession();

    return (
      userSession ? (
        <ProfileMenu />
      ) : (
        <Button
          size="small"
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={CredentialsMenu.handleLoginRequest}
        >
          Sign in
        </Button>
      )
    );
  }
}

CredentialsMenu.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.isRequired,
  }).isRequired,
};

CredentialsMenu.contextType = AuthContext;

export default withStyles(styles)(CredentialsMenu);
