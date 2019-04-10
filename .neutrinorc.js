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
        },
        env: {
          ALTERNATIVE_AUTH: false,
        },
      }
    ],
    '@neutrinojs/jest',
    [
      '@neutrinojs/copy', {
        patterns: [
          { from: 'src/static/triageOwners.json', to: 'triageOwners.json' },
        ],
      },
    ]
  ]
};
