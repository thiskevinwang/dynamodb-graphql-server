import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TABLE_NAMES } from "../.."

export const createSnacksTable: ResolverFn = async (
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
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
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
