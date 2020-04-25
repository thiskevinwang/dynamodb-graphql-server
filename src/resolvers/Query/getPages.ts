import chalk from "chalk";
import { PAGES } from "../index";

const green = chalk.underline.greenBright;

export const getPages = async (obj, args, context, info) => {
  const table = PAGES;
  const { docClient } = context;
  const { fieldName, parentType } = info;

  const params = {
    TableName: table,
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
    .scan(
      params
      // 🚫
      // function(err, data) {
      //   if (err) {
      //     console.error(
      //       "Unable to update item. Error JSON:",
      //       JSON.stringify(err, null, 2)
      //     );
      //   } else {
      //     console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      //   }
      // }
    )
    .promise()
    .then((res) => {
      console.group(green(`${chalk.bold(parentType)}: ${fieldName}`));
      console.log(res);
      console.log("\n");
      console.groupEnd();
      const { Items, Count, ScannedCount } = res;
      // Restructure the dynamodb response for better graphql handling
      return { Pages: Items, Count, ScannedCount };
    });
};
