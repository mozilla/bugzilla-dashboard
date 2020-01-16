import React from 'react';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import { redirectUser } from '../../components/auth/oauth2';

export default class OAuth2Login extends React.PureComponent {
  state = {};

  componentDidMount() {
    if (!window.location.hash) {
      // Start login flow
      redirectUser();
    }
  }

  render() {
    const { loginError } = this.state;
    if (loginError) {
      return <ErrorPanel error={loginError} />;
    }

    if (window.location.hash) {
      return <p>Logging in..</p>;
    }

    return <p>Redirecting..</p>;
  }
}
