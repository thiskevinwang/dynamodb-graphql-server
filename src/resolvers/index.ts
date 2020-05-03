import * as Query from "./Query"
import * as Mutation from "./Mutation"
import * as productsQueries from "./Products/Queries"
import * as productsMutations from "./Products/Mutations"
import * as usersQueries from "./Users/Queries"
import * as usersMutations from "./Users/Mutations"
import * as votesQueries from "./Votes/Queries"
import * as votesMutations from "./Votes/Mutations"

export enum TABLE_NAMES {
  Snacks = "Snacks",
}

export const resolvers = {
  Query: { ...Query, ...productsQueries, ...usersQueries, ...votesQueries },
  Mutation: {
    ...Mutation,
    ...productsMutations,
    ...usersMutations,
    ...votesMutations,
  },
}

export default resolvers
