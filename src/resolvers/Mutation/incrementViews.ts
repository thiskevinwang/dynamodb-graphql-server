import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

/**
 * Increment an atomic counter
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.04
 */
export const incrementViews: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { id, location } = args
  const { docClient } = context

  const now = Date.now()
  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: PAGES,
    Key: {
      id,
      location,
    },
    UpdateExpression:
      "set attributes.#views = attributes.#views + :v, attributes.updated_at = :u",
    ExpressionAttributeNames: {
      "#views": "views",
    },
    ExpressionAttributeValues: {
      ":v": 1,
      ":u": now,
    },
    ReturnValues: "UPDATED_NEW",
  }

  /**
   * In order to get a return value from `docClient`, you need to call
   * docClient.update(params).promise.
   *
   * But if you specify a callback too - docClient.update(params, (err,data) => {...}).promise()
   * This gets evaluated TWICE.
   */
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
