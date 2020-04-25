import { Context } from "../../index"

export type ResolverFn<R = any, A = any> = (
  parent: any,
  args: A,
  context: Context,
  info: any
) => Promise<R>
