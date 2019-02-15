import {
  makeExecutableSchema,
  makeRemoteExecutableSchema,
} from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import typeDefs from './bugzilla.graphql';

const link = new HttpLink({
  uri: process.env.BUGZILLA_ENDPOINT,
  fetch,
});
const schema = makeExecutableSchema({ typeDefs: [typeDefs] });

export default makeRemoteExecutableSchema({ schema, link });
