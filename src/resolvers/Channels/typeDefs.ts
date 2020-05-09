import { gql } from "apollo-server"

export const channelTypeDef = gql`
  interface ChannelAttr {
    channelName: String
    description: String
  }
  type Channel implements Row & ChannelAttr {
    PK: ID!
    SK: String
    createdAt: Date
    updatedAt: Date
    channelName: String
    description: String
  }

  extend type Mutation {
    createChannel(channelName: String!, description: String): Channel @auth
  }

  extend type Query {
    queryChannels(filter: String): [Channel]
  }
`
