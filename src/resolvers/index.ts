import * as Query from "./Query"
import * as Mutation from "./Mutation"

export const PAGES = "Pages"
export const IPS = "Ips"

export enum TABLE_NAMES {
  Pages = "Pages",
  Ips = "Ips",
  Snacks = "Snacks",
}

export const resolvers = {
  Query,
  Mutation,
}

export default resolvers
