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
  }

  type User {
    PK: String
    SK: String
    username: String
    fullname: String
    email: String
    createdAt: Date
  }

  type Vote {
    PK: String
    SK: String
    productName: String
    rating: Float
    usernames: String
  }

  type Mutation {
    createProduct(
      category: String!
      name: String!
      tastes: [String]
      textures: [String]
      imageUrls: [String]
    ): Snack
    createProductsTable: Table
    createUser(username: String, fullname: String, email: String): User
    seedVotes(snackName: String!, email: String): String @development
    updateProduct(name: String): Product
  }

  type Query {
    listTables: [String]
    queryProducts(category: String): [Product]
    queryVotes(email: String, indexName: String): [Vote]
    scanProductsTable: [Product] @development
  }
`
