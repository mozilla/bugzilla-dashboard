import { mergeSchemas } from 'graphql-tools';
import local from './local';
import bugzilla from './bugzilla';

export default mergeSchemas({
  schemas: [local, bugzilla],
});
