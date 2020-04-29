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
    PK: String
    SK: String
    createdAt: Date
    updatedAt: Date
  }

  type User {
    PK: String
    SK: String
    username: String
    fullname: String
    email: String
    createdAt: Date
    updatedAt: Date
  }

  type Vote {
    PK: String
    SK: String
    productName: String
    rating: Float
    username: String
    createdAt: Date
    updatedAt: Date
  }

  type Mutation {
    createProduct(name: String!): Product
    createTable: Table
    createUser(username: String, email: String): User
    createVote(productName: String!, email: String): Vote @development
    updateProduct(name: String): Product
  }

  type Query {
    listTables: [String]
    queryProducts: [Product]
    queryVotes(email: String, indexName: String): [Vote]
    scanProductsTable: [Product] @development
  }
`
