import { DocumentClient } from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

export const getPage: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { id, location } = args
  const { docClient } = context

  const params: DocumentClient.GetItemInput = {
    TableName: PAGES,
    Key: {
      id,
      location,
    },
  }
  /**
   * In order to get a return value from `docClient`, you need to call
   * docClient.get(params).promise.
   *
   * But if you specify a callback too - docClient.get(params, (err,data) => {...}).promise()
   * This gets evaluated TWICE.
   */
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
