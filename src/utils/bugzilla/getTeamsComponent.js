import fetchJson from '../fetchJson';
import { bugzillaAPILink } from '../../config';

const getComponentsData = async () => {
  const response = fetchJson(`${bugzillaAPILink}components`);
  return response;
};

const teamBugsCount = (components) => {
  const result = {};

  const keys = Object.keys(components[0]);

  // _.each(components, (component) => {
  components.forEach((component) => {
    if (!result[component.team]) {
      result[component.team] = component;
    } else {
      keys.forEach((key) => {
        if (key !== 'team') {
          result[component.team][key].count += (component[key].count);
        }
      });
    }
  });
  return result;
};

const getTeamsComponent = async (teamComponents) => {
  const data = await getComponentsData();
  const components = [];
  // For each components in the array, fetch data from data object
  const { team } = teamComponents;
  teamComponents.product.forEach((product) => {
    teamComponents.component.forEach((component) => {
      if (data[`${product}::${component}`] !== undefined) {
        data[`${product}::${component}`].team = team;
        components.push(data[`${product}::${component}`]);
      }
    });
  });
  const rr = teamBugsCount(components);
  return rr;
};

export default getTeamsComponent;
