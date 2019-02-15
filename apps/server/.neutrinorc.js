module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    ['@mozilla-frontend-infra/node-lint', {
      rules: {
        'no-console': 'off',
      },
    }],
    ['@neutrinojs/node', {
      hot: false,
    }],
    (neutrino) => {
      neutrino.config.externals(/^[a-z\-0-9]+$/);
      neutrino.config.module
        .rule('graphql')
          .test(/\.graphql$/)
          .include
            .add(neutrino.options.source)
            .end()
          .use('tag')
            .loader(require.resolve('graphql-tag/loader'));
    },
  ],
};
