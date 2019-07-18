import fetchJson from '../fetchJson';
import { bugsAPIUrl } from '../../config';

const getComponentsData = async () => {
  const response = fetchJson(`${bugsAPIUrl}components`);
  return response;
};

const getReporteesData = async (partialOrg, ldapEmail) => {
  const data = fetch(`${bugsAPIUrl}reportees/`,
    {
      method: 'post',
      body: JSON.stringify({
        data: partialOrg,
        email: ldapEmail,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(
      response => response.json(),
    )
    .then(res => (res));
  return data;
};

export { getComponentsData, getReporteesData };
