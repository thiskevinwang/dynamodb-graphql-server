import { gql } from "apollo-server"

export const dataScalarTypeDef = gql`
  scalar Date
`

export const directivesTypeDef = gql`
  directive @development on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION
`

export const dynamoTableTypeDef = gql`
  type ProvisionedThroughput {
    LastIncreaseDateTime: String
    LastDecreaseDateTime: String
    NumberOfDecreasesToday: Int
    ReadCapacityUnits: Int
    WriteCapacityUnits: Int
  }

  type KeySchema {
    AttributeName: String
    KeyType: String
  }

  type AttributeDefinitions {
    AttributeName: String
    AttributeType: String
  }

  type TableDescription {
    TableName: String
    TableStatus: String
    CreationDateTime: String
    TableSizeBytes: Int
    ItemCount: Int
    TableArn: String
    ProvisionedThroughput: ProvisionedThroughput
    KeySchema: [KeySchema]
    AttributeDefinitions: [AttributeDefinitions]
  }

  type Table {
    TableDescription: TableDescription
  }

  extend type Mutation {
    createTable: Table @development @auth
  }
  extend type Query {
    listTables: [String] @auth
  }
`
export const productTypeDef = gql`
  type Product {
    PK: ID
    SK: String
    createdAt: Date
    updatedAt: Date
    productName: String
  }
  extend type Mutation {
    createProduct(productName: String!): Product @auth
    updateProduct(productName: String!): Product @auth
  }
  extend type Query {
    getProduct(productName: String!): Product
    queryProducts: [Product]
    queryProductsByName(productName: String): [Product]
    scanProductsTable: [Product] @development @auth
  }
`
export const userTypeDef = gql`
  type User {
    PK: ID
    SK: String
    createdAt: Date
    updatedAt: Date
    username: String
    firstName: String
    lastName: String
    email: String
    avatarUrl: String
  }
  extend type Mutation {
    createUser(username: String!, email: String!): User @development
    updateUserAvatarUrl(avatarUrl: String!): User @auth
  }
  extend type Query {
    getUser(username: String!, email: String!): User
    queryUsers: [User]
  }
`

export const voteTypeDef = gql`
  type Vote {
    PK: ID
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

export const authTypeDef = gql`
  type S3Payload {
    signedPutObjectUrl: String!
    objectUrl: String!
  }

  type AuthPayload {
    token: String!
  }

  extend type Mutation {
    login(email: String!, password: String!, username: String!): AuthPayload
    signup(
      email: String!
      password: String!
      username: String!
      firstName: String!
      lastName: String!
    ): AuthPayload
    s3GetSignedPutObjectUrl(
      fileName: String!
      """
      A standard MIME type describing thhe format of the object data.
      jpg, jpeg, png, etc.
      """
      fileType: String!
      fileSize: Int!
    ): S3Payload! @auth
  }
`

/**
 * For 'empty base typed', omit `{}`
 * @see https://github.com/ardatan/graphql-tools/issues/450#issuecomment-431008246
 */
export const baseTypeDef = gql`
  type Mutation
  type Query
`
