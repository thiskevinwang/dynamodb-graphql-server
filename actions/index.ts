require("dotenv").config();
const AWS = require("aws-sdk");

// Safe to say that running `now` updates `process.env.NODE_ENV` to `production`
const isEnvProduction = process.env.NODE_ENV === "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";

const USERS = "Users";

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

export function createUsersTable() {
  var params = {
    TableName: USERS,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" },
      { AttributeName: "username", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "username", AttributeType: "S" }
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
// isEnvDevelopment && createUsersTable();

/**
 * createUser()
 * @note this won't return any data
 */
export function createUser({ username, id }) {
  const table = USERS;

  var params = {
    TableName: table,
    Item: {
      id: id,
      username: username,
      attributes: {}
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
// isEnvDevelopment && createUser();

/**
 * updateItem
 */
export function updateUser({ id, username, rating }) {
  var table = USERS;

  // Update the item, unconditionally,

  var params = {
    TableName: table,
    Key: {
      id,
      username
    },
    UpdateExpression: "set attributes.rating = :r",
    ExpressionAttributeValues: {
      ":r": rating
    },
    ReturnValues: "UPDATED_NEW"
  };

  return docClient
    .update(params, function(err, data) {
      if (err) {
        console.error(
          "Unable to update item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
    })
    .promise()
    .then(res => {
      console.log("res", res);
      return res;
    });
}

/**
 * scanUsers
 */
export function scanUsers() {
  var table = USERS;

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
