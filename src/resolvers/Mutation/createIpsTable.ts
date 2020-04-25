import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { IPS } from "../index"

export const createIpsTable: ResolverFn = async (obj, args, context, info) => {
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

  return dynamoDb.createTable(params).promise()
}
