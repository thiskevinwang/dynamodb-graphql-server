import chalk from "chalk";

import { PAGES } from "../index";

const yellow = chalk.underline.yellowBright;

/**
 * Increment an atomic counter
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.04
 */
export const incrementViews = async (obj, args, context, info) => {
  const { id, location } = args;
  const { docClient } = context;
  const {
    fieldName, // 'incrementViews'
    parentType, // Mutation
  } = info;

  const now = Date.now();
  const params = {
    TableName: PAGES,
    Key: {
      id,
      location,
    },
    UpdateExpression:
      "set attributes.#views = attributes.#views + :v, attributes.updated_at = :u",
    ExpressionAttributeNames: {
      "#views": "views",
    },
    ExpressionAttributeValues: {
      ":v": 1,
      ":u": now,
    },
    ReturnValues: "UPDATED_NEW",
  };

  /**
   * In order to get a return value from `docClient`, you need to call
   * docClient.update(params).promise.
   *
   * But if you specify a callback too - docClient.update(params, (err,data) => {...}).promise()
   * This gets evaluated TWICE.
   */
  return docClient
    .update(params)
    .promise()
    .then((res) => {
      console.group(yellow(`${chalk.bold(parentType)}: ${fieldName}`));
      console.log(chalk.grey(location));
      console.log(res);
      console.log("\n");
      console.groupEnd();
      return res.Attributes.attributes;
    });
};
