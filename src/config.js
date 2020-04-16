const PRODUCTION = process.env.NODE_ENV === 'production';
export const TASKCLUSTER_ROOT_URL = PRODUCTION ? 'https://firefox-ci-tc.services.mozilla.com' : 'https://stage.taskcluster.nonprod.cloudops.mozgcp.net';

const channel = PRODUCTION ? 'production' : 'testing';

const config = {
  artifactRoute: `project.relman.${channel}.bugzilla-dashboard.latest`,
  OAuth2Options: {
    clientId: PRODUCTION ? 'bugzilla-dashboard-production' : 'bugzilla-dashboard-localdev',
    scopes: ['queue:get-artifact:project/relman/bugzilla-dashboard/*'],
    authorizationUri: `${TASKCLUSTER_ROOT_URL}/login/oauth/authorize`,
    accessTokenUri: `${TASKCLUSTER_ROOT_URL}/login/oauth/token`,
    credentialsUri: `${TASKCLUSTER_ROOT_URL}/login/oauth/credentials`,
    redirectUri: PRODUCTION ? 'https://bugzilla-management-dashboard.netlify.app' : 'http://localhost:5000',
    whitelisted: true,
    responseType: 'code',
    maxExpires: '15 minutes',
  },
  productComponentMetrics: 'project/relman/bugzilla-dashboard/product_component_data.json.gz',
  reporteesMetrics: 'project/relman/bugzilla-dashboard/reportee_data.json.gz',
  peopleTree: 'project/relman/bugzilla-dashboard/people.json.gz',
};

export const REPORTEES_CONFIG = {
  assigned_defect: {
    label: 'Assigned (defect)',
    // Max count of assigned defects - to highlight defects on Reportees dashboard
    maxCount: 20,
  },
  assigned_total: {
    label: 'Assigned (total)',
  },
  needinfo: {
    label: 'Needinfo',
    // Max count of needinfo issues - to highlight defects on Reportees dashboard
    maxCount: 10,
  },
  assignedTrackedBeta: {
    label: 'Assigned & Tracked (Beta)',
  },
  assignedTrackedNightly: {
    label: 'Assigned & Tracked (Nightly)',
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
export const PRODUCT_COMPONENT = {
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
          f1: 'cf_tracking_firefox_beta', o1: 'anyexact',    v1: '+,blocking',
          f2: 'cf_status_firefox_beta',   o2: 'equals',      v2: 'affected',
          f3: 'assigned_to',           o3: 'equals',      v3: 'nobody@mozilla.org',
      },
  },

  nightlyNewBug: {
      label: 'Nightly New Regression',
      hidden: true,
      parameters: {
          // TODO: make that dynamic when https://github.com/mozilla-bteam/bmo/pull/1165
          // landed
          keywords: 'regression,',
          keywords_type: 'allwords',
          resolution: '---',

          f1: 'cf_status_firefox_nightly',   o1: 'equals',       v1: 'affected',
          f2: 'OP',                    j2: 'OR',
          f3: 'cf_status_firefox_beta',   o3: 'equals',       v3: 'unaffected',
          f4: 'cf_status_firefox_beta',   o4: 'equals',       v4: '?',
          f5: 'cf_status_firefox_beta',   o5: 'equals',       v5: '---',
          f6: 'CP',
          f7: 'flagtypes.name',        o7: 'notsubstring', v7: 'needinfo',
          f8: 'cf_tracking_firefox_nightly', o8: 'notequals',    v8: '-',
          f9: 'keywords',              o9: 'notsubstring', v9: 'stalled',
      },
  },

  nightlyCarryOver: {
      label: 'Nightly carry over',
      hidden: true,
      parameters: {
          // TODO: make that dynamic when https://github.com/mozilla-bteam/bmo/pull/1165
          // landed
          keywords: 'regression,',
          keywords_type: 'allwords',
          resolution: '---',
          f1: 'cf_status_firefox_nightly',   o1: 'equals',       v1: 'affected',
          f2: 'OP',                    j2: 'OR',           n2: '1',
          f3: 'cf_status_firefox_beta',   o3: 'equals',       v3: 'unaffected',
          f4: 'cf_status_firefox_beta',   o4: 'equals',       v4: '?',
          f5: 'cf_status_firefox_beta',   o5: 'equals',       v5: '---',
          f6: 'CP',
          f7: 'flagtypes.name',        o7: 'notsubstring', v7: 'needinfo',
          f8: 'cf_tracking_firefox_nightly', o8: 'notequals',    v8: '-',
          f9: 'keywords',              o9: 'notsubstring', v9: 'stalled',
      },
  },

    newDefects: {
      label: 'New defects',
      hidden: true,
      parameters: {
          f1: 'creation_ts', o1: 'greaterthaneq', v1: '-1y',
          priority: '--',
          resolution: '---',
          bug_type: 'defect',
      },
  },

  needinfo: {
      label: 'Needinfo',
      hidden: true,
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
