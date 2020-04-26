import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"

import { IPS } from "../index"

export const trackIpVisits: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context
  /**
   * # ipAddress
   * - `x-forwared-for` will not appear in `context.req.headers` if the request is
   *   coming from the same machine. The browser will use a "shortpath" and won't
   *   access the internet
   * @see https://www.prisma.io/forum/t/how-do-i-get-the-ip-address-from-the-client/4429/6
   */
  const ipAddress = Array.isArray(context.req.headers["x-forwarded-for"])
    ? context.req.headers["x-forwarded-for"][0]
    : context.req.headers["x-forwarded-for"] ?? "no ip"
  const now = Date.now()

  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: IPS,
    Key: {
      id: 1,
      ipAddress,
    },
    // Item: {
    //   id: 1,
    //   ipAddress: ipAddress
    //   // visits: now
    // },
    /**
     * Use `list_append()` and `if_not_exists()` together in an `UpdateExpression`
     * to append to a potentially non-existent list column:
     * @see https://stackoverflow.com/questions/41400538/append-a-new-object-to-a-json-array-in-dynamodb-using-nodejs
     */
    UpdateExpression:
      "set #visits = list_append(if_not_exists(#visits, :empty_list), :now)",
    ExpressionAttributeNames: {
      "#visits": "visits",
    },
    ExpressionAttributeValues: {
      ":now": [now],
      ":empty_list": [],
    },
    ReturnValues: "UPDATED_OLD",
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
