import { stringify } from 'query-string';
import untriagedParameters from './untriagedParameters';
import fetchJson from '../fetchJson';
import settings from './settings';

const queryBugzilla = async queryParameters => (
  fetchJson(`${settings.BZ_HOST}/rest/bug?${queryParameters}`));

const getUntriagedBugsCount = async (product, component) => {
  // eslint-disable-next-line camelcase
  const { bug_count = 0 } = await queryBugzilla(
    stringify({
      product,
      component,
      ...untriagedParameters(),
      count_only: 1, // This only returns the bug count
    }),
  );
  // eslint-disable-next-line camelcase
  return bug_count;
};

export default getUntriagedBugsCount;
