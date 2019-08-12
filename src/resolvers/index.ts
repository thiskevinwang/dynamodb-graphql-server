import { createUsersTable, createUser, updateUser } from "../../actions";

import Query from "./Query";

export const resolvers = {
  Query,
  Mutation: {
    createUsersTable: () => {
      return createUsersTable();
    },
    createUser: (obj, args, context, info) => {
      console.log("args", args);
      return createUser({ username: args.username, id: args.id });
    },
    rateUser: (obj, args, context, info) => {
      return updateUser({
        username: args.username,
        id: args.id,
        rating: args.rating
      });
    }
  }
};

export default resolvers;
