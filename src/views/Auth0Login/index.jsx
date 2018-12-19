import React from 'react';
import Error from '../../components/Error';
import { webAuth, userSessionFromAuthResult } from '../../components/auth/auth0';

export default class Auth0Login extends React.PureComponent {
  state = {};

  /* eslint-disable consistent-return */
  componentDidMount() {
    const { history } = this.props;

    if (!window.location.hash) {
      return webAuth.authorize();
    }

    // for silent renewal, auth0-js opens this page in an iframe, and expects
    // a postMessage back, and that's it.
    if (window !== window.top) {
      window.parent.postMessage(window.location.hash, window.origin);

      return;
    }

    webAuth.parseHash(window.location.hash, (loginError, authResult) => {
      if (loginError) {
        return this.setState({ loginError });
      }

      // eslint-disable-next-line react/destructuring-assignment
      this.props.setUserSession(userSessionFromAuthResult(authResult));

      if (window.opener) {
        window.close();
      } else {
        history.push('/');
      }
    });
  }

  render() {
    const { loginError } = this.state;
    if (loginError) {
      return <Error error={loginError} />;
    }

    if (window.location.hash) {
      return <p>Logging in..</p>;
    }

    return <p>Redirecting..</p>;
  }
}
