import { gql } from "apollo-server"

export const teamsTypeDef = gql`
  interface TeamAttributes {
    teamName: String
  }
  type Team implements Row & TeamAttributes {
    PK: ID!
    SK: String
    createdAt: Date
    updatedAt: Date
    teamName: String
  }
  extend type Mutation {
    createTeam(teamName: String!): Team @development
  }
  extend type Query {
    getTeam(teamName: String!): Team
    queryTeams: [Team]
  }
`
