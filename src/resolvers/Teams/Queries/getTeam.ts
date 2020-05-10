import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

type Args = { teamName: string }
export const getTeam: ResolverFn<any, Args> = async (
  obj,
  { teamName },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TableNames.SNACKS,
    Key: {
      PK: `TEAM#${teamName}`,
      SK: `#TEAM`,
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
