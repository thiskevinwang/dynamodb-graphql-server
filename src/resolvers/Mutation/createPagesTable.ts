import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

export const createPagesTable: ResolverFn = async (
  obj,
  args,
  context,
  info
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

  return dynamoDb.createTable(params).promise()
}
