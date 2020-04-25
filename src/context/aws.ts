require("dotenv").config();
const AWS = require("aws-sdk");

// Safe to say that running `now` updates `process.env.NODE_ENV` to `production`
const isEnvProduction = process.env.NODE_ENV === "production";
const isEnvDevelopment = process.env.NODE_ENV === "development";

AWS.config.update(
  isEnvProduction
    ? {
        region: "us-east-1",
        endpoint: "https://dynamodb.us-east-1.amazonaws.com",
        // endpoint: "https://dynamodb.us-east-1.amazonaws.com",
        // accessKeyId default can be used while using the downloadable version of DynamoDB.
        // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        // secretAccessKey default can be used while using the downloadable version of DynamoDB.
        // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
      }
    : {
        endpoint: "http://localhost:8081",
        accessKeyId: "zeaq37",
        secretAccessKey: "eyw4ab",
        region: "localhost",
      }
);

/**
 * Locking the API Version
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
 */
const dynamodb = new AWS.DynamoDB({
  apiVersion: "2012-08-10",
  endpoint: "http://localhost:8081",
  accessKeyId: "zeaq37",
  secretAccessKey: "eyw4ab",
  region: "localhost",
});
const docClient = new AWS.DynamoDB.DocumentClient();

export { AWS, dynamodb, docClient };
