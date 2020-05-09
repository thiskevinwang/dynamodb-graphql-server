import * as authMutations from "./Auth/Mutations"
import * as channelsMutation from "./Channels/Mutations"
import * as channelsQueries from "./Channels/Queries"
import * as messagesMutation from "./Messages/Mutations"
import * as messagesQueries from "./Messages/Queries"
import * as s3Mutations from "./S3/Mutations"
import * as tablesMutation from "./Tables/Mutations"
import * as tablesQueries from "./Tables/Queries"
import * as usersMutations from "./Users/Mutations"
import * as usersQueries from "./Users/Queries"

export enum TableNames {
  SNACKS = "Snacks",
}

export const resolvers = {
  Query: {
    ...channelsQueries,
    ...messagesQueries,
    ...tablesQueries,
    ...usersQueries,
  },
  Mutation: {
    ...authMutations,
    ...channelsMutation,
    ...messagesMutation,
    ...s3Mutations,
    ...tablesMutation,
    ...usersMutations,
  },
}

export default resolvers
