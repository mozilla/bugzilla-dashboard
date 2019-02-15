import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { WebAuth } from 'auth0-js';

const auth = new WebAuth({
  domain: process.env.AUTH_DOMAIN,
  clientID: process.env.AUTH_CLIENT_ID,
  redirectUri: process.env.AUTH_REDIRECT_URI,
  responseType: process.env.AUTH_RESPONSE_TYPE,
  scope: process.env.AUTH_SCOPE,
});
const parseHash = () =>
  new Promise((resolve, reject) => {
    auth.parseHash((err, result) => {
      if (err) {
        reject(err);
      } else if (!result || !result.idTokenPayload) {
        reject(new Error('Authentication missing payload'));
      } else {
        resolve(result);
      }
    });
  });

export default
@hot(module)
class Login extends Component {
  state = {
    credentials: null,
  };

  async componentDidMount() {
    if (!window.location.hash) {
      localStorage.removeItem('credentials');

      return auth.authorize();
    }

    const credentials = await parseHash();

    localStorage.setItem('credentials', JSON.stringify(credentials));
    this.setState({ credentials });
  }

  render() {
    if (!this.state.credentials) {
      return null;
    }

    return (
      <Redirect
        to={{
          pathname: '/',
          state: { credentials: this.state.credentials },
        }}
      />
    );
  }
}
