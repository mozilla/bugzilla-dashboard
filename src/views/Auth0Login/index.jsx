import React from 'react';
import PropTypes from 'prop-types';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import { webAuth, userSessionFromAuthResult } from '../../components/auth/auth0';

export default class Auth0Login extends React.PureComponent {
  static propTypes = {
    history: PropTypes.shape({}).isRequired,
    setUserSession: PropTypes.func.isRequired,
  };

  state = {};

  componentDidMount() {
    const { history, setUserSession } = this.props;

    if (!window.location.hash) {
      webAuth.authorize();
    } else if (window !== window.top) {
      // for silent renewal, auth0-js opens this page in an iframe, and expects
      // a postMessage back, and that's it.
      window.parent.postMessage(window.location.hash, window.origin);
    } else {
      webAuth.parseHash(window.location.hash, (loginError, authResult) => {
        if (loginError) {
          this.setState({ loginError });
        } else {
          setUserSession(userSessionFromAuthResult(authResult));
          if (window.opener) {
            window.close();
          } else {
            history.push('/');
          }
        }
      });
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
