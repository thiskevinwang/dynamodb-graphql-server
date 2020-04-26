import DynamoDB from "aws-sdk/clients/dynamodb"
import ora from "ora"

import { ResolverFn } from "resolvers/ResolverFn"
import allMovies from "./__mocks__/moviedata.json"

const spinner = ora("Seeding Movies")

export const seedMoviesTable: ResolverFn = async (
  obj,
  args,
  context,
  { fieldName, parentType }
) => {
  const { docClient } = context
  let count = 0
  spinner.start()

  return await Promise.all([
    ...allMovies.map(async movie => {
      const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: "Movies",
        Item: {
          year: movie.year,
          title: movie.title,
          info: movie.info,
        },
      }

      return await docClient
        .put(params)
        .promise()
        .then(res => {
          spinner.text = `Seeding Movies - ${++count}`
          // console.info(parentType.name, fieldName, res)
          return res.Attributes
        })
        .catch(err => {
          // console.error(parentType.name, fieldName, err.message)
          throw err
        })
    }),
  ]).then(() => {
    spinner.succeed(`Done - Added ${count} movies`)
    return "ok"
  })
  // return "ok"
}
