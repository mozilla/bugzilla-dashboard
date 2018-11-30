/* This is a script to regenerate triageOwners.json
 * This script is not used as part of the running of the app
 * Redirect the output to src/static/triageOwners.json
 */
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');

function generateTriageOwners() {
  fetch('https://bugzilla.mozilla.org/rest/product'
  + '?type=accessible&include_fields=name&include_fields=components'
  + '&exclude_fields=components.flag_types&exclude_fields=components.description')
    .then(res => res.json())
    .then((bzComponents) => {
      const owners = {};
      for (let i = 0; i < bzComponents.products.length;) {
        const product = bzComponents.products[i];
        for (let j = 0; j < product.components.length;) {
          const triageOwner = product.components[j].triage_owner;
          if (triageOwner && triageOwner !== '') {
            if (!owners[triageOwner]) {
              owners[triageOwner] = [];
            }
            owners[triageOwner].push({
              product: product.name,
              component: product.components[j].name,
            });
          }
          j += 1;
        }
        i += 1;
      }
      fs.writeFile('src/static/triageOwners.json', JSON.stringify(owners, null, 4), (err) => {
        if (err) console.log('error', err);
      });
    })
    .catch(error => console.error(error));
}

generateTriageOwners();
