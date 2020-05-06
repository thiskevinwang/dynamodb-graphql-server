import * as authMutations from "./Auth/Mutations"
import * as channelsMutation from "./Channels/Mutations"
import * as channelsQueries from "./Channels/Queries"
import * as messagesMutation from "./Messages/Mutations"
import * as messagesQueries from "./Messages/Queries"
import * as productsMutations from "./Products/Mutations"
import * as productsQueries from "./Products/Queries"
import * as s3Mutations from "./S3/Mutations"
import * as tablesMutation from "./Tables/Mutations"
import * as tablesQueries from "./Tables/Queries"
import * as usersMutations from "./Users/Mutations"
import * as usersQueries from "./Users/Queries"
import * as votesMutations from "./Votes/Mutations"
import * as votesQueries from "./Votes/Queries"

export enum TableNames {
  SNACKS = "Snacks",
}

export const resolvers = {
  Query: {
    ...channelsQueries,
    ...messagesQueries,
    ...productsQueries,
    ...tablesQueries,
    ...usersQueries,
    ...votesQueries,
  },
  Mutation: {
    ...authMutations,
    ...channelsMutation,
    ...messagesMutation,
    ...productsMutations,
    ...s3Mutations,
    ...tablesMutation,
    ...usersMutations,
    ...votesMutations,
  },
}

export default resolvers
