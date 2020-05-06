import { ApolloError } from "apollo-server"
import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."
import { getFormattedDate } from "../../../utils"

type Args = {
  channelName: string
  username: string
  body: string
}
export const createMessage: ResolverFn<any, Args> = async (
  obj,
  { channelName, username, body },
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: TableNames.SNACKS,
    Item: {
      PK: `CHANNEL#${channelName}`,
      SK: `MESSAGE#${username}#${getFormattedDate(new Date())}`,
      createdAt: new Date().toISOString(),
      channelName,
      username,
      body,
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
     */
    ConditionExpression: "#PK <> :pk", // put succeed if # !== :

    /**
     * use this to avoid the error:
     * _"Invalid ConditionExpression: Attribute name is a reserved keyword;_
     */
    ExpressionAttributeNames: {
      "#PK": "PK", // set # === Item.location
    },
    ExpressionAttributeValues: {
      ":pk": `CHANNEL#${channelName}`,
    },

    /**
     * Required to return a value
     * NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW
     *
     * https://stackoverflow.com/a/55171022/9823455
     *
     * ⚠️ `put` only allows "NONE" | "ALL_OLD"
     */
    ReturnValues: "NONE",
  }

  return docClient
    .put(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      // return res.Attributes
      return params.Item
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw new ApolloError(err)
    })
}
