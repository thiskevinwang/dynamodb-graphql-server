import { UserInputError } from "apollo-server"
import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { TableNames } from "../.."

type Args = {
  teamName: string
  channelName: string
  description?: string
}
export const createTeamChannel: ResolverFn<any, Args> = async (
  obj,
  { teamName, channelName, description },
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context
  // throw new ApolloError("oops")
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: TableNames.SNACKS,
    Item: {
      PK: `TEAM#${teamName}`,
      SK: `CHANNEL#${channelName}`,
      createdAt: new Date().toISOString(),
      teamName,
      channelName,
      description,
    },
    /**
     * ConditionExpression
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html
     */
    ConditionExpression: "#SK <> :sk",
    ExpressionAttributeNames: {
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":sk": `CHANNEL#${channelName}`,
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
      throw new UserInputError("That name is already taken!")
    })
}
