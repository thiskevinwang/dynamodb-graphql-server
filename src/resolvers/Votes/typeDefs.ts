import { gql } from "apollo-server"

export const voteTypeDef = gql`
  type Vote implements Row {
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
