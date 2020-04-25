import chalk from "chalk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { IPS } from "../index"

const green = chalk.underline.greenBright

export const getIps: ResolverFn = async (obj, args, context, info) => {
  const table = IPS
  const { docClient } = context
  const { fieldName, parentType } = info

  const params: DocumentClient.ScanInput = {
    TableName: table,
    // Key: {
    //   year: year,
    //   title: title
    // },
    // UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
    // ExpressionAttributeValues: {
    //   ":r": 5.5,
    //   ":p": "Everything happens all at once.",
    //   ":a": ["Larry", "Moe", "Curly"]
    // },
    // ReturnValues: "UPDATED_NEW"
  }

  console.log("Scanning for items...")
  return docClient
    .scan(
      params
      // 🚫
      // function(err, data) {
      //   if (err) {
      //     console.error(
      //       "Unable to update item. Error JSON:",
      //       JSON.stringify(err, null, 2)
      //     );
      //   } else {
      //     console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      //   }
      // }
    )
    .promise()
    .then(res => {
      console.group(green(`${chalk.bold(parentType)}: ${fieldName}`))
      console.log(res)
      console.log("\n")
      console.groupEnd()
      const { Items, Count, ScannedCount } = res
      // Restructure the dynamodb response for better graphql handling
      console.log(Items)
      // return { Ips: Items, Count, ScannedCount };
      return Items
    })
}
