import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TABLE_NAMES } from "../.."

export const scanSnacksTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context

  const params: DocumentClient.ScanInput = {
    TableName: TABLE_NAMES.Snacks,
    Limit: 50,
  }

  return docClient
    .scan(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.Items
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err)
      throw err
    })
}
