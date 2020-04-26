import DynamoDB from "aws-sdk/clients/dynamodb"

import { ResolverFn } from "resolvers/ResolverFn"
import allMovies from "./__mocks__/moviedata.json"

export const seedMoviesTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context
  allMovies.forEach(movie => {
    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: "Movies",
      Item: {
        year: movie.year,
        title: movie.title,
        info: movie.info,
      },
    }

    docClient
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
  })
  return "ok"
}
