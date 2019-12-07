import chalk from "chalk";

import { IPS, PAGES, USER_ADDED, USER_UPDATED } from "./index";

const yellow = chalk.underline.yellowBright;

const createPagesTable = async (obj, args, context, info) => {
  const { dynamodb } = context;
  const { fieldName, parentType } = info;

  const params = {
    TableName: PAGES,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }, // partition key
      { AttributeName: "location", KeyType: "RANGE" } // sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "location", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  return dynamodb
    .createTable(params)
    .promise()
    .then((res, rej) => {
      if (res) console.log("resolved:", res);
      if (rej) console.log("rejected:", rej);
    });
};

const createPage = async (obj, args, context, info) => {
  const { id, location } = args;
  const { docClient } = context;
  const { fieldName, parentType } = info;

  const created_at = Date.now();

  /**
   * preventing overwrite
   * @see https://stackoverflow.com/a/46531548/9823455
   */
  const params = {
    TableName: PAGES,
    Item: {
      id: id,
      location: location,
      attributes: {
        views: 1,
        created_at,
        updated_at: null
      }
    },
    /**
     * ConditionExpression
     * @see https://stackoverflow.com/a/46531548/9823455
     * @type {String}
     * - A condition that must be satisfied in order for a conditional PutItem operation to succeed.
     *   - True => put succeeds
     *
     * An expression can contain any of the following:
     *
     * Functions: attribute_exists | attribute_not_exists | attribute_type | contains | begins_with | size
     * These function names are case-sensitive.
     *
     * Comparison operators: ` = | <> | < | > | <= | >= | BETWEEN | IN `
     * Logical operators: ` AND | OR | NOT`
     *
     * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.SpecifyingConditions.html
     * */
    ConditionExpression: "#location <> :location", // put succeed if # !== :
    /**
     * use this to avoid the error:
     * _"Invalid ConditionExpression: Attribute name is a reserved keyword;_
     */
    ExpressionAttributeNames: {
      "#location": "location" // set # === Item.location
    },
    ExpressionAttributeValues: {
      ":location": location // set : === location
    }
    /** ` NONE | ALL_OLD | UPDATED_OLD | ALL_NEW | UPDATED_NEW ` */
    // ReturnValues: "UPDATED_OLD"
  };

  /**
   * docClient.put() doesn't return anything
   */
  return docClient.put(params, function(err, data) {
    console.group(yellow(`${chalk.bold(parentType)}: ${fieldName}`));
    console.log(chalk.grey(location));

    if (err) {
      console.error(chalk.red(err));
    } else {
      console.log(data);
    }
    console.log("\n");
    console.groupEnd();
  });
};

/**
 * Increment an atomic counter
 * @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.04
 */
const incrementViews = async (obj, args, context, info) => {
  const { id, location } = args;
  const { docClient } = context;
  const {
    fieldName, // 'incrementViews'
    parentType // Mutation
  } = info;

  const now = Date.now();
  const params = {
    TableName: PAGES,
    Key: {
      id,
      location
    },
    UpdateExpression:
      "set attributes.#views = attributes.#views + :v, attributes.updated_at = :u",
    ExpressionAttributeNames: {
      "#views": "views"
    },
    ExpressionAttributeValues: {
      ":v": 1,
      ":u": now
    },
    ReturnValues: "UPDATED_NEW"
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
    .then(res => {
      console.group(yellow(`${chalk.bold(parentType)}: ${fieldName}`));
      console.log(chalk.grey(location));
      console.log(res);
      console.log("\n");
      console.groupEnd();
      return res.Attributes.attributes;
    });
};

const createIpsTable = async (obj, args, context, info) => {
  const { dynamodb } = context;

  const params = {
    TableName: IPS,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" }, // partition key
      { AttributeName: "ipAddress", KeyType: "RANGE" } // sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "ipAddress", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  return dynamodb
    .createTable(params)
    .promise()
    .then((res, rej) => {
      if (res) console.log("resolved:", res);
      if (rej) console.log("rejected:", rej);
    });
};

/**
 * @deprecated
 *
 * use `trackIpVisits` instead
 */
// const trackIp = async (obj, args, context, info) => {
//   const { docClient } = context;
//   const {
//     fieldName,
//     parentType // Mutation
//   } = info;
//   /**
//    * # ipAddress
//    * - `x-forwared-for` will not appear in `context.req.headers` if the request is
//    *   coming from the same machine. The browser will use a "shortpath" and won't
//    *   access the internet
//    * @see https://www.prisma.io/forum/t/how-do-i-get-the-ip-address-from-the-client/4429/6
//    */
//   const ipAddress = context.req.headers["x-forwarded-for"] || "no ip";
//   const now = Date.now();

//   const params = {
//     TableName: IPS,
//     Item: {
//       id: 1,
//       ipAddress: ipAddress,
//       visits: [now]
//     }
//     // ReturnValues: "UPDATED_NEW"
//   };

//   const value = docClient.put(params, function(err, data) {
//     console.group(yellow(`${chalk.bold(parentType)}: ${fieldName}`));
//     console.log(chalk.grey(ipAddress));
//     if (err) {
//       console.error(chalk.red(err));
//     } else {
//       console.log(data);
//     }
//     console.log("\n");
//     console.groupEnd();
//   });
//   console.log("value", value);
//   return ipAddress;
// };

const trackIpVisits = async (obj, args, context, info) => {
  const { docClient } = context;
  const {
    fieldName,
    parentType // Mutation
  } = info;
  /**
   * # ipAddress
   * - `x-forwared-for` will not appear in `context.req.headers` if the request is
   *   coming from the same machine. The browser will use a "shortpath" and won't
   *   access the internet
   * @see https://www.prisma.io/forum/t/how-do-i-get-the-ip-address-from-the-client/4429/6
   */
  const ipAddress = context.req.headers["x-forwarded-for"] || "no ip";
  const now = Date.now();

  const params = {
    TableName: IPS,
    Key: {
      id: 1,
      ipAddress
    },
    // Item: {
    //   id: 1,
    //   ipAddress: ipAddress
    //   // visits: now
    // },
    /**
     * Use `list_append()` and `if_not_exists()` together in an `UpdateExpression`
     * to append to a potentially non-existent list column:
     * @see https://stackoverflow.com/questions/41400538/append-a-new-object-to-a-json-array-in-dynamodb-using-nodejs
     */
    UpdateExpression:
      "set #visits = list_append(if_not_exists(#visits, :empty_list), :now)",
    ExpressionAttributeNames: {
      "#visits": "visits"
    },
    ExpressionAttributeValues: {
      ":now": [now],
      ":empty_list": []
    }
    // ReturnValues: "UPDATED_NEW"
  };

  const value = docClient.update(params, function(err, data) {
    console.group(yellow(`${chalk.bold(parentType)}: ${fieldName}`));
    console.log(chalk.grey(ipAddress));
    if (err) {
      console.error(chalk.red(err));
    } else {
      console.log(data);
    }
    console.log("\n");
    console.groupEnd();
  });
  console.log("value", value);
  return ipAddress;
};

export default {
  createIpsTable,
  createPagesTable,
  createPage,
  incrementViews,
  // trackIp,
  trackIpVisits
};
