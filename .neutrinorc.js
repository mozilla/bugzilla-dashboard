module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    '@neutrinojs/airbnb',
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'bugzilla-dashboard'
        }
      }
    ],
    '@neutrinojs/jest'
  ]
};
