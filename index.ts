import { ApolloServer, PubSub } from "apollo-server"
import { Request, Response } from "express"

import { typeDefs } from "./src/schema.graphql"
import { resolvers } from "./src/resolvers"
import { AWS, dynamoDb, docClient } from "./src/context/aws"

const pubsub = new PubSub()
export interface Context {
  pubsub: PubSub
  dynamoDb: typeof dynamoDb
  docClient: typeof docClient
  req: Request
  res: Response
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: request => ({
    ...request,
    AWS,
    dynamoDb,
    docClient,
    pubsub,
  }),
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`)
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
})
