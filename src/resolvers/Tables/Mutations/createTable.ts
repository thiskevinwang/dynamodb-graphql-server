import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

export const createTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { dynamoDb } = context

  const params: DynamoDB.CreateTableInput = {
    TableName: TableNames.SNACKS,
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" }, // Partition key
      { AttributeName: "SK", KeyType: "RANGE" }, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" },
      { AttributeName: "ProductVote", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    // LocalSecondaryIndexes: [
    //   {
    //     IndexName: "LSI_ProductVote",
    //     KeySchema: [
    //       // Local Secondary indices must have the
    //       // same hash key as the main table
    //       { AttributeName: "PK", KeyType: "HASH" },
    //       { AttributeName: "productName", KeyType: "RANGE" },
    //     ],
    //     /**
    //      * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Projection.html
    //      */
    //     Projection: {
    //       // KEYS_ONLY | ALL | INCLUDE
    //       ProjectionType: "ALL",
    //       // ProjectionType: "INCLUDE",
    //       // NonKeyAttributes: ["Email", "Rating", "SnackName"],
    //     },
    //   },
    // ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "GSI_ProductVote",
        KeySchema: [
          // Local Secondary indices must have the
          // same hash key as the main table
          { AttributeName: "ProductVote", KeyType: "HASH" },
          // { AttributeName: "productName", KeyType: "RANGE" },
        ],
        /**
         * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Projection.html
         */
        Projection: {
          // KEYS_ONLY | ALL | INCLUDE
          ProjectionType: "ALL",
          // ProjectionType: "INCLUDE",
          // NonKeyAttributes: ["Email", "Rating", "SnackName"],
        },
        // No provisioned throughput specified
        // for the global secondary index
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: "GSI_InvertedIndex",
        KeySchema: [{ AttributeName: "SK", KeyType: "HASH" }],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
  }

  /**
   * CREATE
   */
  return dynamoDb
    .createTable(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.TableDescription
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw err
    })
  /**
   * DELETE
   */
  return dynamoDb
    .deleteTable({ TableName: TableNames.SNACKS })
    .promise()
    .then(res => {
      console.log("res", res.TableDescription)
      return res
    })
}
