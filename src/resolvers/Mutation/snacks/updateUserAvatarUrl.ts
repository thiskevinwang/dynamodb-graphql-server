import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TABLE_NAMES } from "../.."
import { getAuthPayload } from "../../../utils"

type Args = {
  avatarUrl: string
}
export const updateUserAvatarUrl: ResolverFn<any, Args> = async (
  obj,
  { avatarUrl },
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context
  const { username, email } = getAuthPayload(context)

  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: TABLE_NAMES.Snacks,
    Key: {
      PK: `USER#${username}`,
      SK: `#USER`,
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
    // ConditionExpression: "#PK <> :pk", // put succeed if # !== :
    UpdateExpression: "SET #UpdatedAt = :now, avatarUrl = :url",
    /**
     * use this to avoid the error:
     * _"Invalid ConditionExpression: Attribute name is a reserved keyword;_
     */
    ExpressionAttributeNames: {
      "#UpdatedAt": "updatedAt",
    },
    ExpressionAttributeValues: {
      ":now": new Date().toISOString(),
      ":url": avatarUrl,
    },

    /**
     * Required to return a value
     * NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW
     *
     * https://stackoverflow.com/a/55171022/9823455
     */
    ReturnValues: "ALL_NEW",
  }

  return docClient
    .update(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.Attributes
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw err
    })
}
