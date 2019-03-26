# Introduction

This page documents the authentication workflow in order to help maintenance in the future.
The configured client can authenticate with the official [https://auth.mozilla.auth0.com](https://auth.mozilla.auth0.com) domain.

## Auth0 related

We're using Auth0 to authenticate the app. It uses a client with the following information:

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
The Auth0 client also requires the use of https, which causes a security alert the first time you load localhost. Disregard the alert and accept the exception.

## Auth flow

The App component uses a Navigation component which contains a CredentialsMenu.

When the App component is instanciated we create an AuthController instance (`this.authController = new AuthController()`). This is marked as a context for the children with `childContextTypes`.

The CredentialsMenu can determine what to render by inspecting if there's a user session via the context (`const userSession = this.context.authController.getUserSession();`). If the user clicks on "Sign out" the user session will be set to null (`this.authController.setUserSession(null)`).

The Auth0LoginMenuItem is displayed when the user is not signed in. It will open a new tab to intiate the `/login` route (`window.open(new URL('/login', window.location), '_blank');`)

When a new tab with the location `/login` is openend it triggers the authentication process. This is handled by the Auth0Login view. If `/login` is loaded without a hash we initiate the authorization via the auth0 client (`return webAuth.authorize()`).

If the authentication via auth0 works it will callback `/login` again but this time with a hash. The Auth0Login view will this time parse the hash via the webauth client. If it works, it will access the authController and set the user session (`this.props.setUserSession(userSessionFromAuthResult(authResult));`). Calling `setUserSession()` will store the user session serialized in the local storage. This will change the user session in all open windows/tabs, eventually triggering a call to any onSessionChanged callbacks. This happens because the AuthController has an event listener for the local storage (`window.addEventListener('storage', foo()`). The event will trigger `loadUserSession()` which will reset the renewal timer and use `mitt` to emit a `user-session-changed` event with the `userSession`.

For renewals we send a message to the parent window (`window.parent.postMessage(window.location.hash, window.origin);`) that should be handled XXX.

The App component is registered for `user-session-changed` events. The event is sent by the AuthController after having stored the userSession in the local storage. These events are handled by the `handleUserSessionChanged` function. This function simply updates the state of `authReady` to true.

This is simply to determine if the UI should be routing or displaying the "Authenticating..." message.

## TaskCluster specifics

The `UserSession` allows handling 'oidc' and 'credentials'. Candidate for removal.