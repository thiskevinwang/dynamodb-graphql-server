import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { IPS } from "../index"

export const createIpsTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { dynamoDb } = context

  const params: DynamoDB.CreateTableInput = {
    TableName: IPS,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }, // partition key
      { AttributeName: "ipAddress", KeyType: "RANGE" }, // sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "ipAddress", AttributeType: "S" },
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
    .deleteTable({ TableName: IPS })
    .promise()
    .then(res => {
      console.log("res", res.TableDescription)
      return res
    })
}
