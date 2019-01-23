module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    ['@mozilla-frontend-infra/node-lint', {
      rules: {
        'import/prefer-default-export': 'off',
        'no-console': 'off',
      },
    }],
    '@neutrinojs/node',
  ],
};
