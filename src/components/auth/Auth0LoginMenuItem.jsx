import React from 'react';
import { LoginIcon } from '@icons/material';

// This authenticates to Auth0 by opening a new Window where Auth0 will do its
// thing, then closing that window when login is complete.

export default class Auth0LoginMenuItem extends React.PureComponent {
  static handleSelect() {
    const loginView = new URL('/login', window.location);
    window.open(loginView, '_blank');
  }

  render() {
    return (
      <LoginIcon onClick={Auth0LoginMenuItem.handleSelect} />
    );
  }
}
