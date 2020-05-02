import { gql } from "apollo-server"

export const typeDefs = gql`
  scalar Date

  directive @development on FIELD_DEFINITION

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

  type Product {
    PK: ID
    SK: String
    createdAt: Date
    updatedAt: Date
    productName: String
  }

  type User {
    PK: ID
    SK: String
    createdAt: Date
    updatedAt: Date
    username: String
    fullname: String
    email: String
  }

  type Vote {
    PK: ID
    SK: String
    createdAt: Date
    updatedAt: Date
    productName: String
    rating: Float
    username: String
  }

  type S3Payload {
    signedPutObjectUrl: String!
    objectUrl: String!
  }

  type AuthPayload {
    token: String!
  }
  type Mutation {
    createProduct(productName: String!): Product
    createTable: Table
    createUser(username: String!, email: String!): User
    createVote(productName: String!, username: String!): Vote
    updateProduct(productName: String!): Product
    #
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
    ): S3Payload!
  }

  type Query {
    listTables: [String]
    getProduct(productName: String!): Product
    getUser(username: String!, email: String!): User
    queryProducts: [Product]
    queryProductsByName(productName: String): [Product]
    queryUsers: [User]
    queryVotesByEmail(email: String): [Vote]
    queryVotesByProduct(productName: String): [Vote]
    scanProductsTable: [Product] @development
  }
`
