import { GraphQLResolveInfo } from "graphql"
// import { IFieldResolver } from "graphql-tools"
import { Context } from "../../index"

export type ResolverFn<R = any, A = any> = (
  parent: any,
  args: A,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<R>
