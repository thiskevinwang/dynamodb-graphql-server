import "dotenv/config"
import * as jwt from "jsonwebtoken"
import { AuthenticationError } from "apollo-server"

import { Context } from "../../index"

export const APP_SECRET = process.env.APP_SECRET

export type TokenPayload = { userId: string }

/**
 * This grabs the `{ userId }` from the jwt in a
 * request's Authorization HTTP header.
 * - Throws an error if there is no Authorization header
 *   - "Not authenticated"
 * - Throws an error if the token is invalid
 *   - "invalid token"
 * - Throws an error if the `secretOrPublicKey` changed
 *   - "invalid signature"
 * @param context the context object from a graphql resolver
 */
export function getUserId(context: Context): string {
  const authorization = context.req.get("Authorization")
  if (authorization) {
    const token = authorization.replace("Bearer ", "")

    // jwt.verify(token, secretOrPublicKey, [options, callback])
    const { userId } = jwt.verify(token, APP_SECRET) as TokenPayload
    return userId
  }

  throw new AuthenticationError("Not authenticated")
}
