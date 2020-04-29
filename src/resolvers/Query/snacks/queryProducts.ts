import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TABLE_NAMES } from "../.."

type Args = { name: string }
export const queryProducts: ResolverFn<any, Args> = async (
  obj,
  { name },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAMES.Snacks,
    KeyConditionExpression: "#PK = :pk and begins_with(#SK, :sk)",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },

    ExpressionAttributeValues: {
      ":pk": `PRODUCT#${name}`,
      ":sk": `Name#`,
      // ":value": "Z",
    },
    // ProjectionExpression: "PK, Tastes",
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
