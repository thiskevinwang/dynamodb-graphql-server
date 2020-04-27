import { TableNameList } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

export const listTables: ResolverFn<TableNameList> = async (
  obj,
  args,
  context,
  { parentType, fieldName }
) => {
  const { dynamoDb } = context

  return dynamoDb
    .listTables()
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.TableNames
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw err
    })
}
