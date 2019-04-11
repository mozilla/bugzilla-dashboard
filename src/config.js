const loginCallbackRoute = '/callback';

const config = {
  redirectRoute: loginCallbackRoute,
  taskclusterSecrets: {
    orgData: 'project/bugzilla-management-dashboard/realOrg',
  },
  auth0Options: {
    domain: process.env.ALTERNATIVE_AUTH ? 'mozilla-frontend-infra.auth0.com' : 'auth.mozilla.auth0.com',
    clientID: process.env.ALTERNATIVE_AUTH ? 'nWIQUJ5lOiyYHgK4Jm5nPs5hM6JUizwt' : 'DGloMN2BXb0AC7lF5eRyOe1GXweqBAiI',
    redirectUri: new URL(loginCallbackRoute, window.location).href,
    scope: 'taskcluster-credentials full-user-credentials openid profile email',
    audience: process.env.ALTERNATIVE_AUTH ? '' : 'login.taskcluster.net',
    responseType: 'token id_token',
  },
};

export default config;
