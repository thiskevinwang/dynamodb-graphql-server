require("dotenv").config()
import AWS from "aws-sdk"

// Safe to say that running `now` updates `process.env.NODE_ENV` to `production`
const __PROD__ = process.env.NODE_ENV === "production"
const __DEV__ = process.env.NODE_ENV === "development"

AWS.config.update(
  __PROD__
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

const options:
  | AWS.DynamoDB.ClientConfiguration
  | AWS.DynamoDB.DocumentClient.DocumentClientOptions = __PROD__
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
      /**
       * if connecting to the NoSQL Workbench DB, use these.
       *
       * if connecting to docker DB, leave empty
       */
      accessKeyId: "zeaq37",
      secretAccessKey: "eyw4ab",
    }
/**
 * Locking the API Version
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
 */
const dynamoDb = new AWS.DynamoDB(options)
/**
 * Difference between DynamoDB & DocumentClient
 * https://stackoverflow.com/a/57807642/9823455
 */
const docClient = new AWS.DynamoDB.DocumentClient(options)

const s3 = new AWS.S3({
  region: "us-east-1",
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
})

export { AWS, dynamoDb, docClient, s3 }
