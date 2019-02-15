import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './local.graphql';
import resolvers from './resolvers';

export default makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers,
});
