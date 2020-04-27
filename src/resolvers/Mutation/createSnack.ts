import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { upperCamelCase } from "../../utils"
import { TABLE_NAMES } from "../"

type CreateSnackArgs = {
  category: string
  name: string
  tastes: string[]
  textures: string[]
  imageUrls: string[]
}
export const createSnack: ResolverFn<any, CreateSnackArgs> = async (
  obj,
  { category, name, tastes, textures, imageUrls },
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context

  /**
   * preventing overwrite
   * @see https://stackoverflow.com/a/46531548/9823455
   */
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: TABLE_NAMES.Snacks,
    Item: {
      PK: `Snack_${upperCamelCase(category)}`,
      SK: `Name_${upperCamelCase(name)}`,
      DisplayName: name,
      Tastes: tastes?.map(e => upperCamelCase(e)) ?? [],
      Textures: textures?.map(e => upperCamelCase(e)) ?? [],
      ImageUrls: imageUrls ?? [],
      Rating: 0,
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
    // ConditionExpression: "#location <> :location", // put succeed if # !== :

    /**
     * use this to avoid the error:
     * _"Invalid ConditionExpression: Attribute name is a reserved keyword;_
     */
    // ExpressionAttributeNames: {
    //   "#location": "location", // set # === Item.location
    // },
    // ExpressionAttributeValues: {
    //   ":location": location, // set : === location
    // },

    /**
     * Required to return a value
     * NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW
     *
     * https://stackoverflow.com/a/55171022/9823455
     */
    ReturnValues: "ALL_OLD",
  }

  return docClient
    .put(params)
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
