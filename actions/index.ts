require("dotenv").config();
const AWS = require("aws-sdk");

// Safe to say that running `now` updates `process.env.NODE_ENV` to `production`
const isEnvProduction = process.env.NODE_ENV === "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";

AWS.config.update({
  region: "us-east-1",
  endpoint: isEnvProduction
    ? "https://dynamodb.us-east-1.amazonaws.com"
    : "http://localhost:8000",
  // endpoint: "https://dynamodb.us-east-1.amazonaws.com",
  // accessKeyId default can be used while using the downloadable version of DynamoDB.
  // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  accessKeyId: isEnvProduction
    ? process.env.MY_AWS_ACCESS_KEY_ID
    : "fakeMyKeyId",
  // secretAccessKey default can be used while using the downloadable version of DynamoDB.
  // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
  secretAccessKey: isEnvProduction
    ? process.env.MY_AWS_SECRET_ACCESS_KEY
    : "fakeSecretAccessKey"
});

/**
 * Locking the API Version
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
 */
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const docClient = new AWS.DynamoDB.DocumentClient();

export function createMovies() {
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
// isEnvDevelopment && createMovies();

/**
 * createItem()
 * @note this won't return any data
 */
export function createItem({ title, year }) {
  const table = "Movies";

  var params = {
    TableName: table,
    Item: {
      year: year,
      title: title
    }
  };

  return docClient
    .put(params, (err, data) => {
      if (err) {
        console.error(
          "Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2)
        );
      } else {
        console.log(
          "PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2)
        );
      }
    })
    .promise()
    .then(result => {
      return result;
    });
}
// isEnvDevelopment && createItem();

/**
 * readItem()
 */
export function readItem({ title }) {
  var table = "Movies";
  var year = 2015;
  // var title = "The Big New Movie";

  var params = {
    TableName: table,
    Key: {
      year: year,
      title: title
    }
  };

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
    .then(result => {
      return result;
    });
}

/**
 * updateItem
 */
export function updateItem() {
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
 * scanItems
 */
export function scanItems() {
  var table = "Movies";

  var params = {
    TableName: table
    // Key: {
    //   year: year,
    //   title: title
    // },
    // UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
    // ExpressionAttributeValues: {
    //   ":r": 5.5,
    //   ":p": "Everything happens all at once.",
    //   ":a": ["Larry", "Moe", "Curly"]
    // },
    // ReturnValues: "UPDATED_NEW"
  };

  console.log("Scanning for items...");
  return docClient
    .scan(params, function(err, data) {
      if (err) {
        console.error(
          "Unable to update item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        // console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
    })
    .promise()
    .then(result => {
      console.log("result", result);
      return result;
    });
}
