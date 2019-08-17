import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date

  type Subscription {
    userAdded: User
    userUpdated: User
  }

  type Attributes {
    rating: Float
    created_at: Date
    updated_at: Date
  }

  type User {
    id: Int
    username: String
    attributes: Attributes
  }

  type Users {
    Count: Int
    ScannedCount: Int
    Users: [User]
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
    getUsers: Users
    getUser(username: String!, id: Int): User
  }

  type Mutation {
    createUsersTable: Table
    createUser(username: String!, id: Int!): User
    rateUser(username: String!, id: Int!, rating: Float!): Attributes
  }
`;
