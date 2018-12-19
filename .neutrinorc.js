module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    ['@neutrinojs/airbnb',
      {
        eslint: {
          rules: {
            'react/prop-types': 'off',
            'react/prefer-stateless-function': 'off',
            'react/no-access-state-in-setstate': 'off',
            'react/forbid-prop-types': 'off',
          }
        }
      }
    ],
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
          { from: 'src/static/fakeOrg.json', to: 'people.json' },
          { from: 'src/static/triageOwners.json', to: 'triageOwners.json' },
        ],
      },
    ]
  ]
};
