import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

type Args = {
  teamName: string
  channelName: string
}
export const queryMessages: ResolverFn<any, Args> = async (
  obj,
  { teamName, channelName },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.QueryInput = {
    TableName: TableNames.SNACKS,
    KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
    // KeyConditionExpression: "#PK = :pk and #SK = :sk",
    // ExpressionAttributeNames: {
    //   "#PK": "PK",
    //   "#SK": "SK",
    // },
    ExpressionAttributeValues: {
      ":pk": `TEAM#${teamName}`,
      ":sk": `#CHANNEL#${channelName}` + `#MESSAGE#`,
      // ":value": "Z",
    },
    // ProjectionExpression: "PK, Tastes",
    // Limit: 10,
    // IndexName: indexName,
  }
  return docClient
    .query(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.Items
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw err
    })
}
