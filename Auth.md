# Introduction

This page documents the authentication workflows in order to help maintenance in the future.
This app can authenticate with the official [https://auth.mozilla.auth0.com](https://auth.mozilla.auth0.com) domain.

## Auth0 related

We're using Auth0 to authenticate the app. It uses a generated client with the following information:

```javascript
const AUTH0 = {
  domain: 'auth.mozilla.auth0.com',
  clientID: 'FK1mJkHhwjulTYBGklxn8W4Fhd1pgT4t',
  // The client has been configured to use '/login' as the callback Uri
  redirectUri: new URL('/login', window.location).href,
  scope: 'taskcluster-credentials full-user-credentials openid profile email',
};
```

The port 8010 is hardcoded on the Auth0 client.
The Auth0 client also requires the use of https, which causes a security alert the first time you load the page.
You will need to add a security exception.

## Auth flow

The App component uses a Navigation component which contains a CredentialsMenu.

When the App component is instanciated we create an AuthController instance (`this.authController = new AuthController()`). This is marked as a context for the children with `childContextTypes`.

The AuthController uses `mitt` to emit events. This allows the App component to register
for `user-session-changed` events. In our case the `App` components registers for those events and it is handled by the `handleUserSessionChanged` function. This function simply updates the state of `authReady` to true.

This is simply to determine if the UI should be routing or displaying the "Authenticating..." message.

## TaskCluster specifics

The `UserSession` allows handling 'oidc' and 'credentials'. Candidate for removal.