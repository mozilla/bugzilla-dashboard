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
    '@neutrinojs/jest',
    [
      '@neutrinojs/copy', {
        patterns: [
          { from: 'src/static/private/people.json', to: 'people.json' },
          { from: 'src/static/triageOwners.json', to: 'triageOwners.json' },
        ],
      },
    ]
  ]
};
