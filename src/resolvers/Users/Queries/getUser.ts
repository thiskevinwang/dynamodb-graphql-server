import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

/**
 * @TODO email is unused for now
 */
type Args = { email: string; username: string }
export const getUser: ResolverFn<any, Args> = async (
  obj,
  { email, username },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TableNames.SNACKS,
    Key: {
      PK: `USER#${username}`,
      SK: "#USER",
    },
  }
  return docClient
    .get(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.Item
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw err
    })
}
