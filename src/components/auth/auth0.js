import { fromNow } from 'taskcluster-client-web';
import { WebAuth } from 'auth0-js';
import UserSession from './UserSession';

const AUTH0 = {
  domain: 'auth.mozilla.auth0.com',
  clientID: 'FK1mJkHhwjulTYBGklxn8W4Fhd1pgT4t',
  redirectUri: new URL('/login', window.location).href,
  scope: 'taskcluster-credentials full-user-credentials openid profile email',
};

export const webAuth = new WebAuth({
  domain: AUTH0.domain,
  clientID: AUTH0.clientID,
  redirectUri: AUTH0.redirectUri,
  // audience: `https://${AUTH0.domain}/api/v2/`,
  audience: 'login.taskcluster.net',
  responseType: 'token id_token',
  scope: AUTH0.scope,
});

export function userSessionFromAuthResult(authResult) {
  return UserSession.fromOIDC({
    oidcProvider: 'mozilla-auth0',
    accessToken: authResult.accessToken,
    fullName: authResult.idTokenPayload.name,
    email: authResult.idTokenPayload.email,
    picture: authResult.idTokenPayload.picture,
    oidcSubject: authResult.idTokenPayload.sub,
    // per https://wiki.mozilla.org/Security/Guidelines/OpenID_connect#Session_handling
    renewAfter: fromNow('15 minutes'),
  });
}

/* eslint-disable consistent-return */
export async function renew({ userSession, authController }) {
  if (
    !userSession
    || userSession.type !== 'oidc'
    || userSession.oidcProvider !== 'mozilla-auth0'
  ) {
    return;
  }

  return new Promise((accept, reject) => webAuth.renewAuth({}, (err, authResult) => {
    if (err) {
      return reject(err);
    } if (!authResult) {
      return reject(new Error('no authResult'));
    }
    authController.setUserSession(userSessionFromAuthResult(authResult));
    accept();
  }));
}
