import { gql } from "apollo-server"

export const productTypeDef = gql`
  interface ProductAttr {
    productName: String
  }
  type Product implements Row & ProductAttr {
    PK: ID!
    SK: String
    createdAt: Date
    updatedAt: Date
    productName: String
  }
  extend type Mutation {
    createProduct(productName: String!): Product @auth
    updateProduct(productName: String!): Product @auth
  }
  extend type Query {
    getProduct(productName: String!): Product
    queryProducts: [Product]
    queryProductsByName(productName: String): [Product]
  }
`
