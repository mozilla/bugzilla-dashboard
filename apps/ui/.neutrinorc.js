const merge = require('babel-merge');

const port = 8010;

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    ['@mozilla-frontend-infra/react-lint', {
      rules: {
        'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'error',
      },
    }],
    ['@neutrinojs/react', {
      html: {
        title: 'Bugzilla Dashboard',
      },
      env: {
        AUTH_DOMAIN: 'auth.mozilla.auth0.com',
        AUTH_CLIENT_ID: '70h90psuJAkUh272vMMUGBzI6m6VisUw',
        AUTH_REDIRECT_URI: `http://localhost:${port}/login`,
        AUTH_RESPONSE_TYPE: 'token id_token',
        AUTH_SCOPE: 'full-user-credentials openid profile email',
      },
      devServer: {
        port,
        historyApiFallback: {
          disableDotRule: true,
        },
        proxy: {
          '/graphql': {
            target: 'http://localhost:8000/graphql',
          },
        },
      },
      devtool: {
        production: 'source-map',
      },
    }],
    (neutrino) => {
      neutrino.config.module.rule('compile').use('babel').tap(options => merge({
        plugins: [
          [require.resolve('@babel/plugin-proposal-decorators'), {
            legacy: true,
          }],
          [require.resolve('@babel/plugin-proposal-class-properties'), {
            loose: true,
          }],
        ],
      }, options));

      neutrino.config.module
        .rule('graphql')
          .test(/\.graphql$/)
          .include
            .add(neutrino.options.source)
            .end()
          .use('tag')
            .loader(require.resolve('graphql-tag/loader'));
    }
  ],
};
