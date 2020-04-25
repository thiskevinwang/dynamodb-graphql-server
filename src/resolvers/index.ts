import Query from "./Query"
import Mutation from "./Mutation"
import Subscription from "./Subscription"

export const PAGES = "Pages"
export const IPS = "IPS"
export const USER_ADDED = "USER_ADDED"
export const USER_UPDATED = "USER_UPDATED"

export const resolvers = {
  Query,
  Mutation,
  Subscription,
}

export default resolvers
