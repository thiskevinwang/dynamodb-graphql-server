require("dotenv").config()
import AWS from "aws-sdk"
import { Parser } from "json2csv"
import fs from "fs"
import { getFormattedDate } from "../src/utils/getFormattedDate"

/**
 * Difference between DynamoDB & DocumentClient
 * https://stackoverflow.com/a/57807642/9823455
 */
const docClient = new AWS.DynamoDB.DocumentClient({
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
})

docClient
  .scan({
    TableName: "Snacks",
  })
  .promise()
  .then(res => {
    console.log(res.Items)
    // console.log(res.Items.length)

    const fields = [
      "PK",
      "SK",
      "createdAt",
      "updatedAt",
      "description",
      "deletedAt",
      "channelName",
      "body",
      "firstName",
      "lastName",
      "email",
      "avatarUrl",
      "username",
      "productName",
      "rating",
    ]

    const opts = { fields }

    try {
      const parser = new Parser(opts)
      const csv = parser.parse(res.Items)

      const filename = `csv/${getFormattedDate(new Date())}.csv`

      fs.writeFile(filename, csv, err => {
        if (err) throw err
        console.log(`${filename} - saved`)
      })
    } catch (err) {
      console.error(err)
    }
  })
  .catch(err => {
    throw err
  })
