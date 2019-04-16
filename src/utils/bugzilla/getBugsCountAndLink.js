import { stringify } from 'query-string';
import settings from './settings';
import queryBugzilla from './queryBugzilla';

const getBugzillaComponentLink = queryParameters => (
  `${settings.BZ_HOST}/buglist.cgi?${stringify(queryParameters)}`);

/* eslint-disable camelcase */
const getBugsCountAndLink = async (parameters) => {
  const link = getBugzillaComponentLink(parameters);
  const { bug_count = 0 } = await queryBugzilla(
    { ...parameters, count_only: 1 },
  );
  return { count: bug_count, link };
};

export default getBugsCountAndLink;
