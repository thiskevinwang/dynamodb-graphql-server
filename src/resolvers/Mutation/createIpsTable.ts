import chalk from "chalk";

import { IPS } from "../index";

const yellow = chalk.underline.yellowBright;

export const createIpsTable = async (obj, args, context, info) => {
  const { dynamodb } = context;

  const params = {
    TableName: IPS,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }, // partition key
      { AttributeName: "ipAddress", KeyType: "RANGE" }, // sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "ipAddress", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  return dynamodb
    .createTable(params)
    .promise()
    .then((res, rej) => {
      if (res) console.log("resolved:", res);
      if (rej) console.log("rejected:", rej);
    });
};
