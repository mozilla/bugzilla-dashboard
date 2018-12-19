const AUTH0 = {
  domain: 'auth.mozilla.auth0.com',
  clientID: 'FK1mJkHhwjulTYBGklxn8W4Fhd1pgT4t',
  redirectUri: new URL('/login', window.location).href,
  scope: 'full-user-credentials openid profile email',
};

export default AUTH0;
