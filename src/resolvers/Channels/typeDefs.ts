import { gql } from "apollo-server"

export const channelTypeDef = gql`
  interface ChannelAttr {
    teamName: String
    channelName: String
    description: String
  }
  type Channel implements Row & ChannelAttr {
    PK: ID!
    SK: String
    createdAt: Date
    updatedAt: Date
    teamName: String
    channelName: String
    description: String
  }

  extend type Mutation {
    """
    deprecated
    """
    createChannel(channelName: String!, description: String): Channel @auth
    createTeamChannel(
      teamName: String!
      channelName: String!
      description: String
    ): Channel @auth
  }

  extend type Query {
    queryChannels(filter: String): [Channel]
    queryTeamChannels(teamName: String!): [Channel]
  }
`
