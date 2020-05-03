import * as tablesQuery from "./Tables/Queries"
import * as tablesMutation from "./Tables/Mutations"
import * as authMutations from "./Auth/Mutations"
import * as productsQueries from "./Products/Queries"
import * as productsMutations from "./Products/Mutations"
import * as s3Mutations from "./S3/Mutations"
import * as usersQueries from "./Users/Queries"
import * as usersMutations from "./Users/Mutations"
import * as votesQueries from "./Votes/Queries"
import * as votesMutations from "./Votes/Mutations"

export enum TableNames {
  SNACKS = "Snacks",
}

export const resolvers = {
  Query: {
    ...tablesQuery,
    ...productsQueries,
    ...usersQueries,
    ...votesQueries,
  },
  Mutation: {
    ...authMutations,
    ...productsMutations,
    ...s3Mutations,
    ...tablesMutation,
    ...usersMutations,
    ...votesMutations,
  },
}

export default resolvers
