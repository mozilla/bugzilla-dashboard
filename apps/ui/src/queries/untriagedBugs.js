import advancedQueriesToFields from '../advancedQueriesToFields';

export default {
  createdAtOrAfter: '2018-06-01T00:00:00.000Z',
  modifiedAtOrAfter: '2018-06-01T00:00:00.000Z',
  priorities: ['--'],
  resolutions: ['---'],
  ...advancedQueriesToFields([
    'flagtypes.name::DOES_NOT_CONTAIN_IN_THE_STRING::needinfo',
  ]),
};
