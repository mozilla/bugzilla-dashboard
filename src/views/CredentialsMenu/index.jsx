import React from 'react';
import AccountCircleIcon from '@icons/material/AccountCircleIcon';
import LoginIcon from '@icons/material/LoginIcon';
import LogoutIcon from '@icons/material/LogoutIcon';

import AuthContext from '../../components/auth/AuthContext';
import config from '../../config';

export default class CredentialsMenu extends React.PureComponent {
  static contextType = AuthContext;

  static handleLoginRequest() {
    const loginView = new URL(config.redirectRoute, window.location);
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

  renderWithoutUser = () => <LoginIcon onClick={CredentialsMenu.handleLoginRequest} style={{ cursor: 'pointer' }} />;

  renderWithUser(userSession) {
    const { context } = this;
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
        {userSession.name}
        <LogoutIcon onClick={() => context.setUserSession(null)} style={{ cursor: 'pointer' }} />
      </div>
    );
  }

  render() {
    // note: an update to the userSession will cause a forceUpdate
    const { context } = this;
    const userSession = context && context.getUserSession();

    return userSession
      ? this.renderWithUser(userSession)
      : this.renderWithoutUser();
  }
}
