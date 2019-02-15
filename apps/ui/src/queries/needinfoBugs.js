import advancedQueriesToFields from '../advancedQueriesToFields';

export default {
  createdAtOrAfter: '2016-06-01T00:00:00.000Z',
  modifiedAtOrAfter: '2016-06-01T00:00:00.000Z',
  priorities: ['--'],
  resolutions: ['---'],
  ...advancedQueriesToFields([
    'flagtypes.name::CONTAINS_ALL_OF_THE_STRING::needinfo',
    'cf_tracking_e10s::IS_NOT_EQUAL_TO:: ',
    'assigned_to::IS_EQUAL_TO::nobody@mozilla.org',
  ]),
};
