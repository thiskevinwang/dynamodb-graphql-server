import { DocumentClient } from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

export const scanPagesTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context

  const params: DocumentClient.ScanInput = {
    TableName: PAGES,
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
