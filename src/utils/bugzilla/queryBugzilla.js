import { stringify } from 'query-string';
import fetchJson from '../fetchJson';
import settings from './settings';

const TRANSFORM_FIELD = {
  chfieldfrom: 'creation_time',
};

const advancedSearchToRestApi = parameters => (
  Object.keys(parameters).reduce((result, key) => {
    const newResult = Object.assign({}, result);
    const newKey = TRANSFORM_FIELD[key] || key;
    newResult[newKey] = parameters[key];
    return newResult;
  }, {})
);

const generateBugzillaRestApiUrl = (queryParameters) => {
  const transformedParameters = advancedSearchToRestApi(queryParameters);
  const query = stringify({ ...transformedParameters });
  return `${settings.BZ_HOST}/rest/bug?${query}`;
};

const queryBugzilla = async queryParameters => (
  fetchJson(generateBugzillaRestApiUrl(queryParameters)));

export default queryBugzilla;
