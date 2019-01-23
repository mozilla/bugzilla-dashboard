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
    ['@neutrinojs/node', {
      targets: {
        // Uses Node.js 8.10 for Netlify's Lambda functions
        node: '8.10',
      },
    }],
  ],
};
