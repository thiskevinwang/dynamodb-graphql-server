import { DocumentClient } from "aws-sdk/clients/dynamodb"
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs"

import type { ResolverFn } from "resolvers/ResolverFn"
import { APP_SECRET } from "../../../utils"
import { TABLE_NAMES } from "../.."

type Args = {
  password: string
  email: string
  username: string
}
type Response = {
  token: string
}
export const login: ResolverFn<Response, Args> = async (
  parent,
  { password, email, username },
  { docClient },
  { fieldName, parentType }
) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAMES.Snacks,
    Key: {
      PK: `USER#${username}`,
      SK: "#USER",
    },
  }

  const user = await docClient
    .get(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.Item
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw err
    })

  const passwordHash = user.password

  try {
    const valid = await bcrypt.compare(password, passwordHash)
    if (!valid) throw new Error("Invalid email or password")
  } catch (err) {
    throw new Error("Failed to validate")
  }

  return {
    token: jwt.sign({ userId: user.PK }, APP_SECRET),
  }
}
