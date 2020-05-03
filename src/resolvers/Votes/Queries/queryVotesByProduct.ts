import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

type Args = {
  productName: string
}
export const queryVotesByProduct: ResolverFn<any, Args> = async (
  obj,
  { productName },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.QueryInput = {
    TableName: TableNames.SNACKS,
    KeyConditionExpression: "SK = :pk",
    // KeyConditionExpression: "#PK = :pk and #SK = :sk",
    // ExpressionAttributeNames: {
    //   "#PK": "PK",
    //   "#SK": "SK",
    // },
    ExpressionAttributeValues: {
      ":pk": `VOTE#${productName}`,
      // ":sk": email,
      // ":value": "Z",
    },
    // ProjectionExpression: "PK, Tastes",
    // Limit: 10,
    IndexName: "GSI_InvertedIndex",
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
