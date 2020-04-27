import { ApolloServer, PubSub, SchemaDirectiveVisitor } from "apollo-server"
import { Request, Response } from "express"
import { GraphQLField } from "graphql"

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

const __PROD__ = process.env.NODE_ENV === "production"

const DEV_ONLY_WARNING = "⚠️ This is a Development-only field"
class DevelopmentDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    field.description = DEV_ONLY_WARNING

    if (__PROD__) {
      field.isDeprecated = true
      field.deprecationReason = DEV_ONLY_WARNING
      field.resolve = () => {
        throw new Error(DEV_ONLY_WARNING)
      }
    }
  }
  // This is only needed if you include `ENUM_VALUE`
  // directive @development on FIELD_DEFINITION | ENUM_VALUE
  // public visitEnumValue(value: GraphQLEnumValue) {}
}

const server = new ApolloServer({
  typeDefs,
  schemaDirectives: {
    development: DevelopmentDirective,
  },
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
