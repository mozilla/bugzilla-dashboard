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
            chfield: '[Bug creation]', chfieldfrom: '2018-06-01', chfieldto: 'Now',
            priority: '--',
            resolution: '---',
            f1: 'flagtypes.name', o1: 'substring', v1: 'needinfo',
        },
    },
    P1: {
        label: 'P1s',
        parameters: {
            chfield: '[Bug creation]', chfieldfrom: '2018-06-01', chfieldto: 'Now',
            priority: 'P1',
            resolution: '---',
        },
    },
};

export default METRICS;
