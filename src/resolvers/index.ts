import * as Query from "./Query"
import * as Mutation from "./Mutation"

export enum TABLE_NAMES {
  Snacks = "Snacks",
}

export const resolvers = {
  Query,
  Mutation,
}

export default resolvers
