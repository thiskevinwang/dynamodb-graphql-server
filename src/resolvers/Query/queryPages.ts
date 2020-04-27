import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

export const queryPages: ResolverFn = async (
  obj,
  args,
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.QueryInput = {
    TableName: PAGES,
    KeyConditionExpression:
      "#id = :id and #location between :letter1 and :letter2",
    ExpressionAttributeNames: {
      "#id": "id",
      "#location": "location",
    },
    ExpressionAttributeValues: {
      ":id": 2,
      ":letter1": "0",
      ":letter2": "Z",
    },
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
