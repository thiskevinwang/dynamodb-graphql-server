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

export { AWS, dynamodb, docClient };
