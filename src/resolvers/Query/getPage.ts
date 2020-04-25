import chalk from "chalk";
import { PAGES } from "../index";

const green = chalk.underline.greenBright;

export const getPage = async (obj, args, context, info) => {
  const { id, location } = args;
  const { docClient } = context;
  const { fieldName, parentType } = info;

  const params = {
    TableName: PAGES,
    Key: {
      id: id,
      location: location,
    },
  };
  /**
   * In order to get a return value from `docClient`, you need to call
   * docClient.get(params).promise.
   *
   * But if you specify a callback too - docClient.get(params, (err,data) => {...}).promise()
   * This gets evaluated TWICE.
   */
  return docClient
    .get(
      params
      // Don't use this callback
      // function(err, data) {
      //   if (err) {
      //     console.error(
      //       "Unable to get item. Error JSON:",
      //       JSON.stringify(err, null, 2)
      //     );
      //   } else {
      //     console.log("getItem succeeded:", JSON.stringify(data, null, 2));
      //   }
      // }
    )
    .promise()
    .then((res) => {
      console.group(green(`${chalk.bold(parentType)}: ${fieldName}`));
      console.log(chalk.grey(location));
      console.log(res);
      console.log("\n");
      console.groupEnd();
      const { Item } = res;
      return Item;
    });
};
