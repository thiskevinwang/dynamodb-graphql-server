import * as Query from "./Query"
import * as Mutation from "./Mutation"
import * as usersQueries from "./Users/Queries"
import * as usersMutations from "./Users/Mutations"
import * as votesQueries from "./Votes/Queries"
import * as votesMutations from "./Votes/Mutations"

export enum TABLE_NAMES {
  Snacks = "Snacks",
}

export const resolvers = {
  Query: { ...Query, ...usersQueries, ...votesQueries },
  Mutation: { ...Mutation, ...usersMutations, ...votesMutations },
}

export default resolvers
