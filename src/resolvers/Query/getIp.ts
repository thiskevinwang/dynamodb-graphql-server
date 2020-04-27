import type { ResolverFn } from "resolvers/ResolverFn"

export const getIp: ResolverFn = async (obj, args, context, info) => {
  const ipAddress = Array.isArray(context.req.headers["x-forwarded-for"])
    ? context.req.headers["x-forwarded-for"][0]
    : context.req.headers["x-forwarded-for"] ?? "no ip"
  return ipAddress
}
