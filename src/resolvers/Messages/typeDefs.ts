import { gql } from "apollo-server"

export const messageTypeDef = gql`
  interface MessageAttr {
    deletedAt: Date
    channelName: String
    username: String
    body: String
  }

  type Message implements Row & MessageAttr {
    PK: ID! # MESSAGE#<channelName>
    SK: String # USER#<username>
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    channelName: String!
    username: String!
    body: String!
  }

  extend type Mutation {
    createMessage(
      teamName: String!
      channelName: String!
      username: String!
      body: String!
    ): Message @auth
  }

  extend type Query {
    queryMessages(teamName: String!, channelName: String!): [Message]
    # queryMessagesByEmail(email: String): [Message]
  }
`
