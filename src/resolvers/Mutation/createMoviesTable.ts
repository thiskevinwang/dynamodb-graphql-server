import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

export const createMoviesTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { dynamoDb } = context

  const params: DynamoDB.CreateTableInput = {
    TableName: "Movies",
    KeySchema: [
      { AttributeName: "year", KeyType: "HASH" }, // Partition key
      { AttributeName: "title", KeyType: "RANGE" }, // Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "year", AttributeType: "N" },
      { AttributeName: "title", AttributeType: "S" },
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
    .deleteTable({ TableName: "Movies" })
    .promise()
    .then(res => {
      console.log("res", res.TableDescription)
      return res
    })
}
