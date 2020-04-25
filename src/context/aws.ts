require("dotenv").config()
import AWS from "aws-sdk"

// Safe to say that running `now` updates `process.env.NODE_ENV` to `production`
const isEnvProduction = process.env.NODE_ENV === "production"
const isEnvDevelopment = process.env.NODE_ENV === "development"

AWS.config.update(
  isEnvProduction
    ? {
        region: "us-east-1",
        // accessKeyId default can be used while using the downloadable version of DynamoDB.
        // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        // secretAccessKey default can be used while using the downloadable version of DynamoDB.
        // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
      }
    : {
        region: "localhost",
        accessKeyId: "zeaq37",
        secretAccessKey: "eyw4ab",
      }
)

/**
 * Locking the API Version
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
 */
const dynamodb = new AWS.DynamoDB(
  isEnvProduction
    ? {
        apiVersion: "2012-08-10",
        region: "us-east-1",
        endpoint: "https://dynamodb.us-east-1.amazonaws.com",
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
      }
    : {
        apiVersion: "2012-08-10",
        region: "localhost",
        endpoint: "http://localhost:8081",
        accessKeyId: "zeaq37",
        secretAccessKey: "eyw4ab",
      }
)
const docClient = new AWS.DynamoDB.DocumentClient()

export { AWS, dynamodb, docClient }
