import ClientOAuth2 from 'client-oauth2';
import UserSession from './UserSession';
import config from '../../config';

export const webAuth = new ClientOAuth2(config.OAuth2Options);

// Part 1 - Redirect the user on Taskcluster instance to start the OAuth2 flow
export function redirectUser() {
  window.location.href = webAuth.code.getUri();
}

// Part 2 - Exchange Oauth code for Taskcluster credentials
export async function userSessionFromCode(url) {
  // Get Oauth access token
  const token = await webAuth.code.getToken(url);

  // Exchange that access token for some Taskcluster credentials
  const request = token.sign({
    method: 'get',
  });
  const resp = await fetch(config.OAuth2Options.credentialsUri, request);
  const payload = await resp.json();

  // Finally build a new user session
  return UserSession.fromTaskclusterAuth(token.accessToken, payload);
}
