import { gql } from "apollo-server"

export const typeDefs = gql`
  scalar Date

  type PageAttributes {
    views: Int
    created_at: Date
    updated_at: Date
  }

  type Page {
    id: Int
    location: String
    attributes: PageAttributes
  }

  type Ip {
    id: Int
    ipAddress: String
    visits: [Date]
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
    ProvisionedThroughput: ProvisionedThroughput
    KeySchema: [KeySchema]
    AttributeDefinitions: [AttributeDefinitions]
  }

  type Table {
    TableDescription: TableDescription
  }

  type Mutation {
    createIpsTable: Table
    createPage(location: String!, id: Int): Page
    createPagesTable: Table
    incrementViews(location: String!, id: Int): PageAttributes
    trackIpVisits: String
  }

  type Query {
    getIp: String!
    scanIpsTable: [Ip]
    getPage(location: String!, id: Int): Page
    scanPagesTable: [Page]
    listTables: [String]
  }
`
