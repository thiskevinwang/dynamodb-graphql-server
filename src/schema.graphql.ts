import { gql } from "apollo-server";

export const typeDefs = gql`
  type Attributes {
    rating: Float
    created_on: Int
    updated_on: Int
  }

  type Item {
    id: Int
    username: String
    attributes: Attributes
  }

  type User {
    Item: Item
  }

  type Users {
    Count: Int
    ScannedCount: Int
    Items: [Item]
  }

  type BillingModeSummary {
    BillingMode: String
    LastUpdateToPayPerRequestDateTime: String
  }

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
    BillingModeSummary: BillingModeSummary
    ProvisionedThroughput: ProvisionedThroughput
    KeySchema: [KeySchema]
    AttributeDefinitions: [AttributeDefinitions]
  }

  type Table {
    TableDescription: TableDescription
  }
  type Query {
    user(title: String!): User
    getUsers: Users
  }

  type Mutation {
    createUsersTable: Table
    createUser(username: String!, id: Int!): User
    rateUser(username: String!, id: Int!, rating: Float!): User
  }
`;
