import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar Date

  type Subscription {
    userAdded: User
    userUpdated: User
  }

  type Attributes {
    views: Int
    visits: Int
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
  type Page {
    id: Int
    location: String
    attributes: Attributes
  }

  """
  Weird DynamoDB response structure...
  """
  type Pages {
    Count: Int
    ScannedCount: Int
    Pages: [Page]
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
    getPages: Pages
    getPage(location: String!, id: Int): Page
  }

  type Mutation {
    createPagesTable: Table
    createPage(location: String!, id: Int): Page
    incrementViews(location: String!, id: Int): Attributes
  }
`;
