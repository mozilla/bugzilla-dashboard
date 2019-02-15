import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import checkJwt from './checkJwt';

const port = process.env.PORT || 8000;
const app = express();
const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ user: req.user }),
});

app.use(checkJwt);
server.applyMiddleware({ app });
app.listen({ port }, () => {
  console.log(`\n\n🚀 GraphQL server started.`);
  console.log(
    '\nOpen the GraphQL Playground and schema explorer in your browser at:' +
      `\n  http://localhost:${port}/graphql\n`
  );
});
