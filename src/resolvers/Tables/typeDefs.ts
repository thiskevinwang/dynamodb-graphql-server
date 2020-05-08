import { gql } from "apollo-server"

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

  """
  Maybe use union type
  http://spec.graphql.org/draft/#sec-Interfaces.Interfaces-Implementing-Interfaces
  """
  type TableItem implements Row & ChannelAttr & MessageAttr & ProductAttr & UserAttr & VoteAttr {
    # Row
    PK: ID!
    SK: String
    createdAt: Date
    updatedAt: Date
    # _Channel
    ### channelName: String
    description: String
    # _Message
    deletedAt: Date
    channelName: String
    ### username: String!
    body: String
    # _Product
    ### productName: String
    # _User
    ### username: String
    firstName: String
    lastName: String
    email: String
    avatarUrl: String
    # _Vote
    productName: String
    rating: Float
    username: String
  }
  extend type Mutation {
    createTable: Table @development @auth
  }
  extend type Query {
    listTables: [String] @auth
    scanTable: [TableItem] @development @auth
  }
`
