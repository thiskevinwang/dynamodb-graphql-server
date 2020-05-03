import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

type Args = { productName: string }
export const getProduct: ResolverFn<any, Args> = async (
  obj,
  { productName },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TableNames.SNACKS,
    Key: {
      PK: `PRODUCT#${productName}`,
      SK: "#PRODUCT",
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
