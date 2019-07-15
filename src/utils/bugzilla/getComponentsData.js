import fetchJson from '../fetchJson';
import { bugzillaAPILink } from '../../config';

const getComponentsData = async () => {
  const response = fetchJson(`${bugzillaAPILink}components`);
  return response;
};

export default getComponentsData;
