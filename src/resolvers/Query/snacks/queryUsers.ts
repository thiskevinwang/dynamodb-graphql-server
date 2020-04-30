import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TABLE_NAMES } from "../.."

type Args = {}
export const queryUsers: ResolverFn<any, Args> = async (
  obj,
  {},
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAMES.Snacks,
    KeyConditionExpression: "SK = :sk",
    // ExpressionAttributeNames: {
    //   "#PK": "PK",
    //   "#SK": "SK",
    // }
    ExpressionAttributeValues: {
      ":sk": `#USER`,
      // ":value": "Z",
    },
    // ProjectionExpression: "PK, Tastes",
    IndexName: "GSI_InvertedIndex",
    Limit: 10,
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
