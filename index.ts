import { createUsersTable, createUser, updateUser, scanUsers } from "./actions";
import { ApolloServer, gql } from "apollo-server";
import { typeDefs } from "./src/schema.graphql";

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
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

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  // Apollo Server 2 ships with GraphQL Playground instead of GraphiQL
  playground: true
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
