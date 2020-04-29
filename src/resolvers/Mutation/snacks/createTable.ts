import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TABLE_NAMES } from "../.."

export const createTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { dynamoDb } = context

  const params: DynamoDB.CreateTableInput = {
    TableName: TABLE_NAMES.Snacks,
    KeySchema: [
      { AttributeName: "PK", KeyType: "HASH" }, // Partition key
      { AttributeName: "SK", KeyType: "RANGE" }, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "PK", AttributeType: "S" },
      { AttributeName: "SK", AttributeType: "S" },
      { AttributeName: "UserId", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    LocalSecondaryIndexes: [
      {
        IndexName: "InvertedIndex",
        KeySchema: [
          { AttributeName: "PK", KeyType: "HASH" },
          { AttributeName: "UserId", KeyType: "RANGE" },
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
    .deleteTable({ TableName: TABLE_NAMES.Snacks })
    .promise()
    .then(res => {
      console.log("res", res.TableDescription)
      return res
    })
}
