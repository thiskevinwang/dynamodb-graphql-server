import { gql } from "apollo-server"

export { authTypeDef } from "./resolvers/Auth/typeDefs"
export { channelTypeDef } from "./resolvers/Channels/typeDefs"
export { dynamoTableTypeDef } from "./resolvers/Tables/typeDefs"
export { messageTypeDef } from "./resolvers/Messages/typeDefs"
export { userTypeDef } from "./resolvers/Users/typeDefs"
export { teamsTypeDef } from "./resolvers/Teams/typeDefs"

export const dataScalarTypeDef = gql`
  scalar Date
`

export const directivesTypeDef = gql`
  directive @development on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION
`

/**
 * Implement Multiple Interface:
 * @see https://stackoverflow.com/a/45229099/9823455
 */
export const itemTypeDef = gql`
  """
  Implemented by every 'row' in the Dynamo table
  """
  interface Row {
    PK: ID!
    SK: String
    createdAt: Date
    updatedAt: Date
  }
`

export const baseTypeDef = gql`
  type Mutation
  type Query
`
