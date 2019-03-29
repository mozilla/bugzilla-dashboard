import React from 'react';
import { object } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { AccountCircleIcon, LoginIcon, LogoutIcon } from '@icons/material';

export default class CredentialsMenu extends React.PureComponent {
  static contextTypes = {
    authController: object,
  };

  static handleLoginRequest() {
    const loginView = new URL('/login', window.location);
    window.open(loginView, '_blank');
  }

  componentDidMount() {
    const { authController } = this.context;
    if (authController) {
      authController.on(
        'user-session-changed',
        this.handleUserSessionChanged,
      );
    }
  }

  componentWillUnmount() {
    const { authController } = this.context;
    if (authController) {
      authController.off(
        'user-session-changed',
        this.handleUserSessionChanged,
      );
    }
  }

  handleUserSessionChanged = () => {
    this.forceUpdate();
  };

  renderWithoutUser = () => <LoginIcon onClick={CredentialsMenu.handleLoginRequest} style={{ cursor: 'pointer' }} />;

  renderWithUser(userSession) {
    const { authController } = this.context;
    const icon = userSession.picture ? (
      <img
        alt={userSession.name}
        src={userSession.picture}
        style={{ width: '2rem', borderRadius: '50%' }}
      />
    ) : (
      <AccountCircleIcon />
    );

    // XXX: I'm not going with Material UI theming; please advise recommended approach
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Typography component="span" variant="subheading" style={{ padding: '0.5rem', color: 'white' }}>
          {userSession.name}
        </Typography>
        <LogoutIcon onClick={() => authController.setUserSession(null)} style={{ cursor: 'pointer' }} />
      </div>
    );
  }

  render() {
    // note: an update to the userSession will cause a forceUpdate
    const { authController } = this.context;
    const userSession = authController && authController.getUserSession();

    return userSession
      ? this.renderWithUser(userSession)
      : this.renderWithoutUser();
  }
}
