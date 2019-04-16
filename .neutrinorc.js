const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const copy = require('@neutrinojs/copy');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb(),
    react({
      html: {
        title: 'bugzilla-dashboard'
      },
      env: {
        ALTERNATIVE_AUTH: false,
      },
    }),
    jest(),
    copy({
        patterns: [
          { from: 'src/static/triageOwners.json', to: 'triageOwners.json' },
        ],
      })
  ]
};
