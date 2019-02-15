const neutrino = require('neutrino');

const config = neutrino().webpack();

module.exports = [config, { ...config, devtool: 'source-map' }];
