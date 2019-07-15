import fetchJson from '../fetchJson';
import { bugsAPIUrl } from '../../config';

const getComponentsData = async () => {
  const response = fetchJson(`${bugsAPIUrl}components`);
  return response;
};

// Calculate bug count by adding bugs for each component in teams array
const teamBugsCount = (components) => {
  const result = {};
  // Get all keys
  const keys = Object.keys(components[0]);

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

// returns total bugs for each metrics of a team
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
  return teamBugsCount(components);
};

export default getTeamsComponent;
