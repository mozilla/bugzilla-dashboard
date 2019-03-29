import React from 'react';
import { object } from 'prop-types';
import { AccountCircleIcon, LogoutIcon } from '@icons/material';
import Auth0LoginMenuItem from '../../components/auth/Auth0LoginMenuItem';

export default class CredentialsMenu extends React.PureComponent {
  static contextTypes = {
    authController: object.isRequired,
  };

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.context.authController.on(
      'user-session-changed',
      this.handleUserSessionChanged,
    );
  }

  componentWillUnmount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.context.authController.off(
      'user-session-changed',
      this.handleUserSessionChanged,
    );
  }

  handleUserSessionChanged = () => {
    this.forceUpdate();
  };

  renderWithoutUser = () => <Auth0LoginMenuItem />;

  renderWithUser(userSession) {
    const { authController } = this.context;
    const icon = userSession.picture ? (
      <img
        alt={userSession.name}
        src={userSession.picture}
        style={{ width: 18, height: 18, borderRadius: 9 }}
      />
    ) : (
      <AccountCircleIcon />
    );
    const title = (
      <span>
        {icon}
        {userSession.name}
      </span>
    );

    return (
      <div>
        {title}
        <LogoutIcon onClick={() => authController.setUserSession(null)} style={{ cursor: 'pointer' }} />
      </div>
    );
  }

  render() {
    // note: an update to the userSession will cause a forceUpdate
    // eslint-disable-next-line react/destructuring-assignment
    const userSession = this.context.authController.getUserSession();

    return userSession
      ? this.renderWithUser(userSession)
      : this.renderWithoutUser();
  }
}
