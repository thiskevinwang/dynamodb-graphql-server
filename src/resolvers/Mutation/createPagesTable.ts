import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

export const createPagesTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { dynamoDb } = context

  const params: DynamoDB.CreateTableInput = {
    TableName: PAGES,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }, // partition key
      { AttributeName: "location", KeyType: "RANGE" }, // sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "location", AttributeType: "S" },
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
    .deleteTable({ TableName: PAGES })
    .promise()
    .then(res => {
      console.log("res", res.TableDescription)
      return res
    })
}
