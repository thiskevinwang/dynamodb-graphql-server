import { ApolloServer, PubSub, SchemaDirectiveVisitor } from "apollo-server"
import { Request, Response } from "express"
import { GraphQLField } from "graphql"

import { typeDefs } from "./src/schema.graphql"
import { resolvers } from "./src/resolvers"
import { AWS, dynamoDb, docClient, s3 } from "./src/context/aws"

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
