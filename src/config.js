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
      parameterGenerator: mail => ({
        f1: 'requestees.login_name', o1: 'equals', v1: mail, f2: 'flagtypes.name', o2: 'substring', v2: 'needinfo?',
      }),
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
  P1Defect: {
      label: 'P1s defect',
      parameters: {
          f1: 'creation_ts', o1: 'greaterthaneq', v1: '-1y',
          priority: 'P1',
          resolution: '---',
          bug_type: 'defect',
      },
  },
  unassignedBetaBugs: {
      label: 'Unassigned tracked beta bugs',
      parameters: {
          // TODO: make that dynamic when https://github.com/mozilla-bteam/bmo/pull/1165
          // landed
          o1: 'anyexact',    v1: '+,blocking',  f1: 'cf_tracking_firefox67',
          o2: 'equals',      v2: 'affected',    f2: 'cf_status_firefox67',
          f3: 'assigned_to', o3: 'equals',      v3: 'nobody@mozilla.org',
      },
  },
    newDefects: {
      label: 'New defects',
      parameters: {
          f1: 'creation_ts', o1: 'greaterthaneq', v1: '-1y',
          priority: '--',
          resolution: '---',
          bug_type: 'defect',
      },
  },
  needinfo: {
      label: 'Needinfo',
      parameters: {
          priority: '--',
          resolution: '---',
          f1: 'flagtypes.name',   o1: 'substring', v1: 'needinfo',
          f2: 'assigned_to',      o2: 'equals',    v2: 'nobody@mozilla.org',
      },
  },

  P1Task: {
      label: 'P1s task',
      parameters: {
          f1: 'creation_ts', o1: 'greaterthaneq', v1: '-1y',
          priority: 'P1',
          resolution: '---',
          bug_type: 'task',
      },
  },
  P1Enhancement: {
      label: 'P1s enhancement',
      parameters: {
          f1: 'creation_ts', o1: 'greaterthaneq', v1: '-1y',
          priority: 'P1',
          resolution: '---',
          bug_type: 'enhancement',
      },
  },
  sec: {
      label: 'sec-{critical, high}',
      parameters: {
          resolution: '---',
          keywords_type: 'anywords',
          keywords: 'sec-critical, sec-high',
      },
  },
};
/* eslint-enable indent */
/* eslint-enable object-property-newline */
/* eslint-enable no-multi-spaces */

export default config;
