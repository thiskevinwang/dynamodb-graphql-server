import { ApolloServer, PubSub } from "apollo-server";
import chalk from "chalk";

import { typeDefs } from "./src/schema.graphql";
import { resolvers } from "./src/resolvers";
import { AWS, dynamodb, docClient } from "./src/context/aws";

const highlight = chalk.bold.underline.blueBright;
const name = "Kevin";

console.log(chalk`
  👋 I'm {bold ${name}}.
  This is a serverless server, built with
  - {hex('#3F20BA') Apollo}
  - {white.bgHex('#000000') Zeit Now}
  - {hex('#CC6600') AWS DynamoDb}
  - {white.bgHex('#007ACC') TypeScript}
  - {hex('#E10098') GraphQL}
`);

// For subscriptions to work, the same single instance of
// PubSub should be in the ApolloServer context object
const pubsub = new PubSub();

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
    docClient,
    pubsub
  })
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${highlight(url)}`);
  console.log(`🚀 Subscriptions ready at ${highlight(subscriptionsUrl)}`);
});
