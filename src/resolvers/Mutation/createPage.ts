import chalk from "chalk"
import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

const yellow = chalk.underline.yellowBright

export const createPage: ResolverFn = async (obj, args, context, info) => {
  const { id, location } = args
  const { docClient } = context
  const { fieldName, parentType } = info

  const created_at = Date.now()

  /**
   * preventing overwrite
   * @see https://stackoverflow.com/a/46531548/9823455
   */
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: PAGES,
    Item: {
      id: id,
      location: location,
      attributes: {
        views: 1,
        created_at,
        updated_at: null,
      },
    },
    /**
     * ConditionExpression
     * @see https://stackoverflow.com/a/46531548/9823455
     * @type {String}
     * - A condition that must be satisfied in order for a conditional PutItem operation to succeed.
     *   - True => put succeeds
     *
     * An expression can contain any of the following:
     *
     * Functions: attribute_exists | attribute_not_exists | attribute_type | contains | begins_with | size
     * These function names are case-sensitive.
     *
     * Comparison operators: ` = | <> | < | > | <= | >= | BETWEEN | IN `
     * Logical operators: ` AND | OR | NOT`
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.SpecifyingConditions.html
     * */
    ConditionExpression: "#location <> :location", // put succeed if # !== :
    /**
     * use this to avoid the error:
     * _"Invalid ConditionExpression: Attribute name is a reserved keyword;_
     */
    ExpressionAttributeNames: {
      "#location": "location", // set # === Item.location
    },
    ExpressionAttributeValues: {
      ":location": location, // set : === location
    },
    /** ` NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW ` */
    // ReturnValues: "UPDATED_OLD"
  }

  /**
   * docClient.put() doesn't return anything
   */
  return docClient.put(params, function (err, data) {
    console.group(yellow(`${chalk.bold(parentType.name)}: ${fieldName}`))
    console.log(chalk.grey(location))

    if (err) {
      console.error(chalk.red(err.message))
    } else {
      console.log(data)
    }
    console.log("\n")
    console.groupEnd()
  })
}
