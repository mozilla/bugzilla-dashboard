import { stringify } from 'query-string';
import fetchJson from '../fetchJson';
import settings from './settings';
import METRICS from './metrics';

const queryBugzilla = async queryParameters => (
  fetchJson(`${settings.BZ_HOST}/rest/bug?${queryParameters}`));

const getBugzillaComponentLink = queryParameters => (
  `${settings.BZ_HOST}/buglist.cgi?${stringify(queryParameters)}`);

/* eslint-disable camelcase */
const getBugsCountAndLink = async (product, component, metric) => {
  const baseParams = {
    product,
    component,
    ...METRICS[metric],
  };
  const link = getBugzillaComponentLink(baseParams);
  const { bug_count = 0 } = await queryBugzilla(
    stringify({ ...baseParams, count_only: 1 }),
  );
  return { count: bug_count, link };
};

export default getBugsCountAndLink;
