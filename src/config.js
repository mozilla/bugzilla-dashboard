const loginCallbackRoute = '/callback';

const config = {
  redirectRoute: loginCallbackRoute,
  taskclusterSecrets: {
    orgData: 'project/bugzilla-management-dashboard/realOrg',
  },
  auth0Options: {
    domain: process.env.ALTERNATIVE_AUTH ? 'mozilla-frontend-infra.auth0.com' : 'auth.mozilla.auth0.com',
    clientID: process.env.ALTERNATIVE_AUTH ? 'nWIQUJ5lOiyYHgK4Jm5nPs5hM6JUizwt' : 'DGloMN2BXb0AC7lF5eRyOe1GXweqBAiI',
    redirectUri: new URL(loginCallbackRoute, window.location).href,
    scope: 'taskcluster-credentials full-user-credentials openid profile email',
    audience: process.env.ALTERNATIVE_AUTH ? '' : 'login.taskcluster.net',
    responseType: 'token id_token',
  },
  reporteesMetrics: {
    assigned: {
      label: 'Assigned',
      parameterGenerator: mail => ({
        email1: mail,
        emailassigned_to1: '1',
        emailtype1: 'exact',
        resolution: '---',
      }),
    },
    needinfo: {
      label: 'Needinfo',
      parameterGenerator: mail => ({ f1: 'requestees.login_name', o1: 'equals', v1: mail }),
    },
  },
};

export const TEAMS_CONFIG = {
  domCore: {
    label: 'DOM Core',
    owner: 'htsai@mozilla.com',
    product: ['Core'],
    component: [
      'DOM: Core & HTML', 'DOM: Events',
      'Editor', 'HTML: Parser', 'Selection', 'Serializers',
      'User events and focus handling',
    ],
  },
  domFission: {
    label: 'DOM Fission',
    owner: 'nkochar@mozilla.com',
    product: ['Core', 'Toolkit'],
    component: [
      'Document Navigation', 'XBL', 'XML', 'XPConnect', 'XSLT',
    ],
  },
  workerStoreage: {
    label: 'Worker and Storage',
    owner: 'aoverholt@mozilla.com',
    product: ['Core', 'Toolkit'],
    component: [
      'DOM: IndexedDB', 'DOM: Push Notifications', 'DOM: Quota Manager',
      'DOM: Service Workers', 'DOM: Web Payments', 'DOM: Web Storage',
      'DOM: Workers',
    ],
  },
};

/* eslint-disable indent */
/* eslint-disable object-property-newline */
/* eslint-disable no-multi-spaces */
export const BZ_QUERIES = {
  newDefects: {
      label: 'New defects',
      parameters: {
          chfield: '[Bug creation]', chfieldfrom: '2018-06-01', chfieldto: 'Now',
          priority: '--',
          resolution: '---',
          f1: 'flagtypes.name', o1: 'notsubstring', v1: 'needinfo',
          bug_type: 'defect',
      },
  },
  needinfo: {
      label: 'Needinfo',
      parameters: {
          chfield: '[Bug creation]', chfieldfrom: '2016-06-01', chfieldto: 'Now',
          priority: '--',
          resolution: '---',
          f1: 'flagtypes.name',   o1: 'substring', v1: 'needinfo',
          f2: 'cf_tracking_e10s', o2: 'notequals', v2: ' ',
          f3: 'assigned_to',      o3: 'equals',    v3: 'nobody@mozilla.org',
      },
  },
  P1: {
      label: 'P1s',
      parameters: {
          chfield: '[Bug creation]', chfieldfrom: '2016-06-01', chfieldto: 'Now',
          priority: 'P1',
          resolution: '---',
      },
  },
};
/* eslint-enable indent */
/* eslint-enable object-property-newline */
/* eslint-enable no-multi-spaces */

export default config;
