module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    '@mozilla-frontend-infra/react-lint',
    ['@neutrinojs/react', {
      devServer: {
        port: 8020,
      },
    }],
  ],
};
