import { hot } from 'react-hot-loader';
import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';

import Main from '../views/Main';
import PropsRoute from '../components/PropsRoute';
import AuthContext from '../components/auth/AuthContext';
import AuthController from '../components/auth/AuthController';
import NotFound from '../components/NotFound';
import OAuth2Login from '../views/OAuth2Login';

const styles = () => ({
  '@global': {
    body: {
      fontFamily: 'Roboto, sans-serif',
      margin: 0,
    },
  },
});

class App extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  };

  state = {
    authReady: false,
    error: undefined,
  };

  authController = new AuthController();

  componentWillUnmount() {
    this.authController.removeListener(
      'user-session-changed',
      this.handleUserSessionChanged,
    );
  }

  handleUserSessionChanged = (userSession) => {
    // Consider auth "ready" when we have no userSession, a userSession with no
    // renewAfter, or a renewAfter that is not in the past.  Once auth is
    // ready, it never becomes non-ready again.
    const { authReady } = this.state;
    if (!authReady) {
      const newState = !userSession
        || !userSession.renewAfter
        || new Date(userSession.renewAfter) > new Date();
      this.setState({ authReady: newState });
    }
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.authController.on(
      'user-session-changed',
      this.handleUserSessionChanged,
    );

    // Start the Oauth code exchange when it hass received as /?code=XXX
    const params = new URLSearchParams(window.location.search);
    if (params.get('code') !== null) {
      this.authController.exchangeCode(window.location.href);
    }

    // we do not want to automatically load a user session on the login views; this is
    // a hack until they get an entry point of their own with no UI.
    if (!window.location.pathname.startsWith('/login')) {
      this.authController.loadUserSession();
    } else {
      this.setState({ authReady: true });
    }
  }


  render() {
    const { authReady, error } = this.state;

    return (
      <BrowserRouter>
        <div>
          {error && <ErrorPanel error={new Error(error)} />}
          {authReady ? (
            <AuthContext.Provider value={this.authController}>
              <Switch>
                <Route path="/" exact>
                  <Redirect to="/reportees" />
                </Route>
                <PropsRoute
                  path="/login"
                  component={OAuth2Login}
                  setUserSession={this.authController.setUserSession}
                />
                <PropsRoute path="/" component={Main} />
                <Route component={NotFound} />
              </Switch>
            </AuthContext.Provider>
          ) : (
            <Spinner loading />
          )}
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(module)(withStyles(styles)(App));
