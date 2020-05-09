import { UserInputError } from "apollo-server"
import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

type Args = {
  teamName: string
}
export const createTeam: ResolverFn<any, Args> = async (
  obj,
  { teamName },
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context

  /**
   * preventing overwrite
   * @see https://stackoverflow.com/a/46531548/9823455
   */
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: TableNames.SNACKS,
    Item: {
      PK: `TEAM#${teamName}`,
      SK: `#TEAM`,
      createdAt: new Date().toISOString(),
      teamName,
    },
    /**
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
      ":pk": `TEAM#${teamName}`,
    },

    /**
     * Required to return a value
     * NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW
     *
     * https://stackoverflow.com/a/55171022/9823455
     *
     * ⚠️ `put` only allows "NONE" | "ALL_OLD"
     */
    ReturnValues: "ALL_OLD",
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
      throw new UserInputError("A team already exists with that name")
    })
}
