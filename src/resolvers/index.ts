import * as Query from "./Query"
import * as Mutation from "./Mutation"
import * as usersQueries from "./Users/Queries"
import * as usersMutations from "./Users/Mutations"

export enum TABLE_NAMES {
  Snacks = "Snacks",
}

export const resolvers = {
  Query: { ...Query, ...usersQueries },
  Mutation: { ...Mutation, ...usersMutations },
}

export default resolvers
