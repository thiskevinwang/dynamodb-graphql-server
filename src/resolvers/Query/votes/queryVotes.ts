import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TABLE_NAMES } from "../.."

type QueryVotesArgs = {
  email: string
  indexName: string
}
export const queryVotes: ResolverFn<any, QueryVotesArgs> = async (
  obj,
  { email, indexName },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAMES.Snacks,
    KeyConditionExpression: "#PK = :pk",
    // KeyConditionExpression: "#PK = :pk and #SK = :sk",
    ExpressionAttributeNames: {
      "#PK": "PK",
      // "#SK": "SK",
    },

    ExpressionAttributeValues: {
      ":pk": `Vote#${email}`,
      // ":sk": email,
      // ":value": "Z",
    },
    // ProjectionExpression: "PK, Tastes",
    // Limit: 10,
    IndexName: indexName,
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
