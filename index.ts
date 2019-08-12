import { ApolloServer } from "apollo-server";

import { typeDefs } from "./src/schema.graphql";
import { resolvers } from "./src/resolvers";
import { AWS, dynamodb, docClient } from "./src/context/aws";

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  // Apollo Server 2 ships with GraphQL Playground instead of GraphiQL
  playground: true,
  context: request => ({
    ...request,
    AWS,
    dynamodb,
    docClient
  })
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
