import { stringify } from 'query-string';
import queryBugzilla from './queryBugzilla';
import settings from './settings';
import { BZ_QUERIES } from '../../config';

const getBugzillaComponentLink = queryParameters => (
  `${settings.BZ_HOST}/buglist.cgi?${stringify(queryParameters)}`);

/* eslint-disable camelcase */
const getBugsCountAndLink = async (product, component, metric) => {
  const baseParams = {
    product,
    component,
    ...BZ_QUERIES[metric].parameters,
  };
  const link = getBugzillaComponentLink(baseParams);
  const { bug_count = 0 } = await queryBugzilla(
    { ...baseParams, count_only: 1 },
  );
  return { count: bug_count, link };
};

export default getBugsCountAndLink;
