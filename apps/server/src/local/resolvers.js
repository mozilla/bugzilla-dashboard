import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import buildGraph from '../buildGraph';
import phonebook from '../../phonebook.json';

const graph = buildGraph(phonebook, 'chris@mozilla.com');

export default {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Time: GraphQLTime,
  JSON: GraphQLJSON,
  Query: {
    reports(parent, { user }, context) {
      if (user !== context.user.email) {
        throw new Error('Unauthorized');
      }

      const dn = `mail=${user},o=com,dc=mozilla`;
      const self = graph.vertexValue(dn);
      const reports = [...graph.verticesFrom(dn)].map(([, user]) => user);

      return [self, ...reports].map(user => ({
        ...user,
        name: user.cn,
        bugzillaEmail: user.bugzillaemail,
      }));
    },
  },
};
