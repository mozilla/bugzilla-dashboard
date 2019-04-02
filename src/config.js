const config = {
  redirectRoute: '/login',
  taskclusterSecrets: {
    fakeOrg: 'garbage/armenzg/fakeOrg',
  },
  auth0Options: {
    domain: 'auth.mozilla.auth0.com',
    clientID: 'FK1mJkHhwjulTYBGklxn8W4Fhd1pgT4t',
    redirectUri: new URL('/login', window.location).href,
    scope: 'taskcluster-credentials full-user-credentials openid profile email',
    audience: 'login.taskcluster.net',
    responseType: 'token id_token',
  },
};

export default config;
