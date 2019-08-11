const { createItem, createMovies, readItem, updateItem } = require("./actions");

const { ApolloServer, gql } = require("apollo-server");
const movies = [
  {
    Item: {
      year: 2015,
      info: {
        rating: 0,
        plot: "Nothing happens at all."
      },
      title: "The Big New Movie"
    }
  },
  {
    Item: {
      year: 2015,
      info: {
        rating: 0,
        plot: "Boop."
      },
      title: "Another New Movie"
    }
  }
];

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];
const typeDefs = gql`
  # Old Schema
  type Book {
    title: String
    author: String
  }

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

  type Query {
    movie(title: String!): Movie
    books: [Book]
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
    books: () => books
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
