import { PAGES, USER_ADDED, USER_UPDATED } from "./index";

const getPage = async (obj, args, context, info) => {
  const { id, location } = args;
  const { docClient } = context;
  const params = {
    TableName: PAGES,
    Key: {
      id: id,
      location: location
    }
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
    .then(res => {
      console.log(res);
      const { Item } = res;
      return Item;
    });
};

const getPages = async (obj, args, context, info) => {
  const table = PAGES;
  const { docClient } = context;

  const params = {
    TableName: table
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
    .then(result => {
      console.log("result", result);
      const { Items, Count, ScannedCount } = result;
      // Restructure the dynamodb response for better graphql handling
      return { Pages: Items, Count, ScannedCount };
    });
};

export default { getPage, getPages };
