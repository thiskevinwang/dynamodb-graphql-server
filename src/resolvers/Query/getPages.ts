import chalk from "chalk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

const green = chalk.underline.greenBright

export const getPages: ResolverFn = async (obj, args, context, info) => {
  const { docClient } = context
  const { fieldName, parentType } = info

  const params: DocumentClient.ScanInput = {
    TableName: PAGES,
  }

  console.log("Scanning for items...")
  return docClient
    .scan(params)
    .promise()
    .then(res => {
      console.group(green(`${chalk.bold(parentType.name)}: ${fieldName}`))
      console.log(res)
      console.log("\n")
      console.groupEnd()
      const { Items, Count, ScannedCount } = res
      // Restructure the dynamodb response for better graphql handling
      return { Pages: Items, Count, ScannedCount }
    })
}
