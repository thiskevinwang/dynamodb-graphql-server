import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ResolverFn } from "resolvers/ResolverFn"

import { PAGES } from "../index"

export const queryMovies: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context

  /**
   * How Queries work in DynamoDB
   * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html
   *
   * "Query condition missed key schema element"
   * @see https://stackoverflow.com/questions/47681108/query-condition-missed-key-schema-element-validation-error
   *
   * @see https://forums.aws.amazon.com/thread.jspa?threadID=221161
   *
   * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.02.html
   */
  const params: DocumentClient.QueryInput = {
    TableName: "Movies",
    KeyConditionExpression:
      "#yr = :yyyy and #foopy between :letter1 and :letter2",
    ExpressionAttributeNames: {
      "#yr": "year",
      "#foopy": "title",
    },
    ExpressionAttributeValues: {
      ":yyyy": 1985,
      ":letter1": "A",
      ":letter2": "L",
    },
  }
  return docClient
    .query(params)
    .promise()
    .then(res => {
      console.info(parentType.name, fieldName, res)
      return res.Items
    })
    .catch(err => {
      console.error(parentType.name, fieldName, err.message)
      throw err
    })
}
