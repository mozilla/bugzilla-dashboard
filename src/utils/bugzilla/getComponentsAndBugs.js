import { stringify } from 'query-string';
import fetchJson from '../fetchJson';
import { bugsAPIUrl } from '../../config';
import settings from './settings';

/* eslint-disable camelcase */
const getComponentsAndBugs = async () => fetchJson(bugsAPIUrl);

const getBugzillaComponentLink = queryParameters => (
  `${settings.BZ_HOST}/buglist.cgi?${stringify(queryParameters)}`);

export { getComponentsAndBugs, getBugzillaComponentLink };
