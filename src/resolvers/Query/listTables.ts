import chalk from "chalk"
import DynamoDB, { TableNameList } from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

const green = chalk.underline.greenBright

export const listTables: ResolverFn<TableNameList> = async (
  obj,
  args,
  context,
  info
) => {
  const { dynamoDb } = context
  const { parentType, fieldName } = info

  let res
  try {
    res = await dynamoDb.listTables().promise()

    console.group(green(parentType.name), `: ${fieldName}`)
    console.log(res)
    console.groupEnd()
    return res.TableNames
  } catch (err) {}
}
