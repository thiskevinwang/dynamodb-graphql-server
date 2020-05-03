import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

type Args = {
  email: string
}
export const queryVotesByEmail: ResolverFn<any, Args> = async (
  obj,
  { email },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.QueryInput = {
    TableName: TableNames.SNACKS,
    KeyConditionExpression: "PK = :pk AND begins_with (SK, :sk) ",
    // KeyConditionExpression: "#PK = :pk and #SK = :sk",
    // ExpressionAttributeNames: {
    //   "#PK": "PK",
    //   "#SK": "SK",
    // },
    ExpressionAttributeValues: {
      ":pk": `USER#${email}`,
      ":sk": `VOTE#`,
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
