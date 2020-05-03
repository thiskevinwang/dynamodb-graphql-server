import { gql } from "apollo-server"

export { authTypeDef } from "./resolvers/Auth/typeDefs"
export { dynamoTableTypeDef } from "./resolvers/Tables/typeDefs"
export { productTypeDef } from "./resolvers/Products/typeDefs"
export { userTypeDef } from "./resolvers/Users/typeDefs"
export { voteTypeDef } from "./resolvers/Votes/typeDefs"

export const dataScalarTypeDef = gql`
  scalar Date
`

export const directivesTypeDef = gql`
  directive @development on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION
`

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
