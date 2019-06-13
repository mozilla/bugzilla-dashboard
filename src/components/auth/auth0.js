import { fromNow } from 'taskcluster-client-web';
import { WebAuth } from 'auth0-js';
import UserSession from './UserSession';
import config from '../../config';

export const webAuth = new WebAuth(config.auth0Options);

export function userSessionFromAuthResult(authResult) {
  return UserSession.fromOIDC({
    oidcProvider: 'mozilla-auth0',
    accessToken: authResult.accessToken,
    fullName: authResult.idTokenPayload.name === '' ? authResult.idTokenPayload.nickname : authResult.idTokenPayload.name,
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
