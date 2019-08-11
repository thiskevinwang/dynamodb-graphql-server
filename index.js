const {
  createItem,
  createMovies,
  readItem,
  updateItem,
  scanItems
} = require("./actions");

const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  # New Schema
  type Info {
    rating: Int
    plot: String
  }

  type Item {
    year: Int
    title: String
    info: Info
  }

  type Movie {
    Item: Item
  }

  type Items {
    title: String
    year: Int
    info: Info
  }

  type AllMovies {
    Count: Int
    ScannedCount: Int
    Items: [Item]
  }

  type Query {
    movie(title: String!): Movie
    getAll: AllMovies
  }

  type Mutation {
    submitMovie(title: String!, year: Int!): Movie
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    movie: (obj, args, context, info) => {
      console.log("args", args);
      return readItem({ title: args.title });
    },
    getAll: (obj, args, context, info) => {
      return scanItems();
    }
  },
  Mutation: {
    submitMovie: (obj, args, context, info) => {
      console.log("args", args);
      return createItem({ title: args.title, year: args.year });
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
