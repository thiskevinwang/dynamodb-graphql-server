import {
  createUsersTable,
  createUser,
  updateUser,
  scanUsers
} from "../../actions";

export const resolvers = {
  Query: {
    getUsers: (obj, args, context, info) => {
      return scanUsers();
    }
  },
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
