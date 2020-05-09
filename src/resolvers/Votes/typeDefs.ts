import { gql } from "apollo-server"

export const voteTypeDef = gql`
  interface VoteAttr {
    productName: String
    rating: Float
    username: String
  }
  type Vote implements Row & VoteAttr {
    PK: ID!
    SK: String
    createdAt: Date
    updatedAt: Date
    productName: String
    rating: Float
    username: String
  }

  extend type Mutation {
    createVote(productName: String!, username: String!): Vote @auth
  }

  extend type Query {
    queryVotesByEmail(email: String): [Vote]
    queryVotesByProduct(productName: String): [Vote]
  }
`
