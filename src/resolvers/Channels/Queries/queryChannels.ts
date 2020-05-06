import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

/**
 * @TODO implement the filter arg
 */
type Args = { filter: string }
export const queryChannels: ResolverFn<any, Args> = async (
  obj,
  {},
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.QueryInput = {
    TableName: TableNames.SNACKS,
    KeyConditionExpression: "SK = :sk",
    // ExpressionAttributeNames: { "#PK": "PK", "#SK": "SK" }
    ExpressionAttributeValues: {
      ":sk": `#CHANNEL`,
    },
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
