import { ApolloServer, PubSub } from "apollo-server"
import { Request, Response } from "express"

import * as typeDefs from "./src/schema.graphql"
import { resolvers } from "./src/resolvers"
import { AWS, dynamoDb, docClient, s3 } from "./src/context/aws"
import { AuthDirective, DevelopmentDirective } from "./src/directives"

const pubsub = new PubSub()
export interface Context {
  pubsub: PubSub
  AWS: typeof AWS
  dynamoDb: typeof dynamoDb
  docClient: typeof docClient
  s3: typeof s3
  req: Request
  res: Response
}

const server = new ApolloServer({
  typeDefs: Object.values(typeDefs),
  schemaDirectives: {
    development: DevelopmentDirective,
    auth: AuthDirective,
  },
  resolvers,
  introspection: true,
  playground: true,
  context: request => ({
    ...request,
    AWS,
    s3,
    dynamoDb,
    docClient,
    pubsub,
  }),
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})
