import { gql } from "apollo-server"

export const typeDefs = gql`
  scalar Date

  directive @development on FIELD_DEFINITION

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

  type TrackIpVisitsResponse {
    visits: [String]
  }

  type MovieInfo {
    directors: [String]
    release_date: Date
    rating: Int
    genres: [String]
    image_url: String
    plot: String
    rank: Int
    running_time_secs: Int
    actors: [String]
  }
  type Movie {
    year: Int
    title: String
    info: MovieInfo
  }
  type Snack {
    PK: String
    SK: String
    DisplayName: String
    Tastes: [String]
    Textures: [String]
    Rating: Int
    ImageUrls: [String]
  }

  type Mutation {
    createIpsTable: Table
    createMoviesTable: Table @development
    createPage(location: String, id: Int): Page
    createPagesTable: Table
    createSnack(
      category: String!
      name: String!
      tastes: [String]
      textures: [String]
      imageUrls: [String]
    ): Snack
    createSnacksTable: Table
    incrementViews(location: String!, id: Int): PageAttributes
    seedMoviesTable: String @development
    trackIpVisits: TrackIpVisitsResponse
  }

  type Query {
    getIp: String!
    getPage(location: String!, id: Int): Page
    listTables: [String]
    queryMovies: [Movie] @development
    queryPages: [Page]
    querySnacks(category: String): [Snack]
    scanIpsTable: [Ip] @development
    scanPagesTable: [Page] @development
    scanSnacksTable: [Snack] @development
  }
`
