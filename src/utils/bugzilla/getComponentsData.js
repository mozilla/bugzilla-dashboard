import fetchJson from '../fetchJson';
import { bugsAPIUrl } from '../../config';

const getComponentsData = async () => {
  const response = fetchJson(`${bugsAPIUrl}components`);
  return response;
};

export default getComponentsData;
