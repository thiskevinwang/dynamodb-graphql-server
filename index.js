require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  // endpoint: "http://localhost:8000",
  // endpoint: "https://dynamodb.us-east-1.amazonaws.com",
  // accessKeyId default can be used while using the downloadable version of DynamoDB.
  // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  // secretAccessKey default can be used while using the downloadable version of DynamoDB.
  // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
});

// console.log(AWS.config);
// console.log("dynamodb", dynamodb);

/**
 * Locking the API Version
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
 */
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const docClient = new AWS.DynamoDB.DocumentClient();

function createMovies() {
  var params = {
    TableName: "Movies",
    KeySchema: [
      { AttributeName: "year", KeyType: "HASH" },
      { AttributeName: "title", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
      { AttributeName: "year", AttributeType: "N" },
      { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  dynamodb.createTable(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to create table: " + "\n" + JSON.stringify(err, undefined, 2)
      );
    } else {
      console.log(
        "Created table: " + "\n" + JSON.stringify(data, undefined, 2)
      );
    }
  });
}
// createMovies();

/**
 * createItem()
 */
function createItem() {
  var params = {
    TableName: "Movies",
    Item: {
      year: 2015,
      title: "The Big New Movie",
      info: {
        plot: "Nothing happens at all.",
        rating: 0
      }
    }
  };
  docClient.put(params, function(err, data) {
    if (err) {
      console.error(
        "Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2)
      );
    } else {
      console.log(
        "PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2)
      );
    }
  });
}
// createItem();

/**
 * readItem()
 */
function readItem() {
  var table = "Movies";
  var year = 2015;
  var title = "The Big New Movie";

  var params = {
    TableName: table,
    Key: {
      year: year,
      title: title
    }
  };

  let foo;
  return docClient
    .get(params, (err, data) => {
      if (err) {
        console.log(
          "Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2)
        );
      } else {
        console.log(
          "GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2)
        );
      }
    })
    .promise()
    .then(promise => {
      console.log(".then.promise", promise);
      return [promise];
    });
}

/**
 * updateItem
 */
function updateItem() {
  var table = "Movies";

  var year = 2015;
  var title = "The Big New Movie";

  // Update the item, unconditionally,

  var params = {
    TableName: table,
    Key: {
      year: year,
      title: title
    },
    UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
    ExpressionAttributeValues: {
      ":r": 5.5,
      ":p": "Everything happens all at once.",
      ":a": ["Larry", "Moe", "Curly"]
    },
    ReturnValues: "UPDATED_NEW"
  };

  console.log("Updating the item...");
  docClient.update(params, function(err, data) {
    if (err) {
      console.error(
        "Unable to update item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
}
// updateItem();

/**
 * =====================================================>
 */

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
    movies: [Movie]
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    movies: (obj, args, context, info) => {
      return readItem();
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
