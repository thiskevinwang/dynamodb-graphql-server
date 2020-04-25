import { gql } from "apollo-server"

export const typeDefs = gql`
  scalar Date

  type Subscription {
    userAdded: User
    userUpdated: User
  }

  type Attributes {
    views: Int
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

  type Ip {
    id: Int
    ipAddress: String
    # TODO: idea
    visits: [Date]
  }
  """
  Weird DynamoDB response structure...
  """
  type Ips {
    Count: Int
    ScannedCount: Int
    Ips: [Ip]
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
    # TODO: remove Pages type, and copy how Ips are handled.
    getPages: Pages
    getPage(location: String!, id: Int): Page
    getIps: [Ip]
    getIp: String!
  }

  type Mutation {
    createPagesTable: Table
    createPage(location: String!, id: Int): Page
    incrementViews(location: String!, id: Int): Attributes
    trackIpVisits: String
    createIpsTable: Table
  }
`
