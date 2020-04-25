import chalk from "chalk";

import { PAGES } from "../index";

const yellow = chalk.underline.yellowBright;

export const createPagesTable = async (obj, args, context, info) => {
  const { dynamodb } = context;
  const { fieldName, parentType } = info;

  const params = {
    TableName: PAGES,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }, // partition key
      { AttributeName: "location", KeyType: "RANGE" }, // sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "location", AttributeType: "S" },
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
