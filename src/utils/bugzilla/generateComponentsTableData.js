import _ from 'lodash';
import { BZ_QUERIES } from '../../config';

const generateComponentsTable = (data) => {
  const teamComponents = {};
  const groupedComponents = _.mapValues(_.groupBy(data, 'product'),
    components => components.map(component => _.omit(component, 'product')));

  Object.entries(groupedComponents).forEach(([teamKey, components]) => {
    teamComponents[teamKey] = {};
    teamComponents[teamKey].components = components;
    teamComponents[teamKey].metrics = {};
    teamComponents[teamKey].label = teamKey;
    teamComponents[teamKey].product = '';
    teamComponents[teamKey].bugzillaEmail = components[0].bugzillaEmail;

    let count = 0;
    Object.keys(BZ_QUERIES).forEach((metric) => {
      count = _.sumBy(components, (component) => {
        if (component.metrics[metric]) {
          return component.metrics[metric].count;
        }
        return '';
      });
      teamComponents[teamKey].metrics[metric] = {
        count,
        link: '#',
      };
    });
  });
  return _.orderBy(Object.values(teamComponents), 'label', 'asc');
};

export default generateComponentsTable;
