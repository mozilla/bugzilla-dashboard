/* eslint-disable indent */
/* eslint-disable object-property-newline */
/* eslint-disable no-multi-spaces */
const METRICS = {
    untriaged: {
        label: 'Untriaged',
        parameters: {
            chfield: '[Bug creation]', chfieldfrom: '2018-06-01', chfieldto: 'Now',
            priority: '--',
            resolution: '---',
            f1: 'flagtypes.name', o1: 'notsubstring', v1: 'needinfo',
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

export default METRICS;
