import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"
import fetch from "isomorphic-unfetch"
import DynamoDB from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"
import { APP_SECRET } from "../../../utils"
import { TableNames } from "../.."

type Args = {
  password: string
  username: string
  firstName: string
  lastName: string
  email: string
}
type User = {
  PK: string
  SK: string
  createdAt: Date
  updatedAt: Date
  username: string
  firstName: string
  lastName: string
  email: string
}
type Response = {
  token: string
}
export const signup: ResolverFn<Response, Args> = async (
  parent,
  { password, username, firstName, lastName, email },
  { docClient },
  { fieldName, parentType }
) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: TableNames.SNACKS,
      Item: {
        PK: `USER#${username}`,
        SK: `#USER`,
        username,
        email,
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
        password: passwordHash,
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
      ConditionExpression: "#PK <> :pk AND #email <> :email", // put succeed if # !== :

      /**
       * use this to avoid the error:
       * _"Invalid ConditionExpression: Attribute name is a reserved keyword;_
       */
      ExpressionAttributeNames: {
        "#PK": "PK", // set # === Item.location
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":pk": `USER#${username}`,
        ":email": email,
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

    await docClient
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

    const token = jwt.sign(
      { email: params.Item.email, username: params.Item.username },
      APP_SECRET
    )

    // Do we want to await here?
    await fetch(process.env.API_GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      /**
       * this ends up as the `event` object of the lambda function
       */
      body: JSON.stringify(params),
    })

    return { token }
  } catch (err) {
    throw new Error(err)
  }
}
