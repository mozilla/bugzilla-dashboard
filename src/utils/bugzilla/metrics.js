/* eslint-disable indent */
/* eslint-disable object-property-newline */
/* eslint-disable no-multi-spaces */
const METRICS = {
    untriaged: {
        f1: 'bug_severity', o1: 'notequals',    v1: 'enhancement',
        f2: 'keywords',     o2: 'notsubstring', v2: 'meta',
        f3: 'resolution',   o3: 'isempty',
        limit: 0,
    },
};

export default METRICS;
