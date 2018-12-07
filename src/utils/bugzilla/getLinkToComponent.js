import { stringify } from 'query-string';
import settings from './settings';
import untriagedParameters from './untriagedParameters';

const getBugzillaComponentLink = (product, component) => (
  `${settings.BZ_HOST}/buglist.cgi?${stringify({ product, component, ...untriagedParameters() })}`);

export default getBugzillaComponentLink;
