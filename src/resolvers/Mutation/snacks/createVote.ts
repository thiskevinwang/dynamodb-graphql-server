import DynamoDB from "aws-sdk/clients/dynamodb"
import _ from "lodash"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TABLE_NAMES } from "../.."

type Args = {
  productName: string
  username: string
}
export const createVote: ResolverFn<any, Args> = async (
  obj,
  { productName, username },
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context

  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: TABLE_NAMES.Snacks,
    Item: {
      PK: `USER#${username}`,
      SK: `VOTE#${productName}`,
      username,
      rating: _.random(0, 5, true).toFixed(1),
      productName,
      createdAt: new Date().toISOString(),
    },
    ConditionExpression: "PK <> :PK AND SK <> :SK",
    ExpressionAttributeValues: {
      ":PK": `USER#${username}`,
      ":SK": `VOTE#${productName}`,
    },
    ReturnValues: "ALL_OLD",
  }

  return docClient
    .put(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.Attributes
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw err
    })
}
