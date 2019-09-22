import { PAGES, USER_ADDED, USER_UPDATED } from "./index";

const createPagesTable = async (obj, args, context, info) => {
  const { dynamodb } = context;

  const params = {
    TableName: PAGES,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" },
      { AttributeName: "location", KeyType: "RANGE" }
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

  dynamodb.createTable(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to create table: " + "\n" + JSON.stringify(err, undefined, 2)
      );
    } else {
      console.log(
        "Created table: " + "\n" + JSON.stringify(data, undefined, 2)
      );
    }
  });
};

const createPage = async (obj, args, context, info) => {
  const { id, location } = args;
  const { docClient, pubsub } = context;
  const created_at = Date.now();
  const params = {
    TableName: PAGES,
    Item: {
      id: id,
      location: location,
      attributes: {
        views: 1,
        visits: 0,
        created_at,
        updated_at: null
      }
    }
  };

  // pubsub.publish(USER_ADDED, { userAdded: args });

  /**
   * docClient.put doesn't return anything
   */
  return docClient
    .put(params, (err, data) => {
      if (err) {
        console.error(
          "Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2)
        );
      } else {
        console.log(
          "PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2)
        );
      }
    })
    .promise()
    .then(res => {
      console.log(res);
      return res;
    });
};

const incrementViews = async (obj, args, context, info) => {
  const { id, location } = args;
  const { docClient } = context;

  const now = Date.now();
  const params = {
    TableName: PAGES,
    Key: {
      id,
      location
    },
    UpdateExpression:
      "set attributes.visits= attributes.visits + :v, attributes.updated_at= :u",
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
      console.log("res", res);
      return res.Attributes.attributes;
    });
};

export default { createPagesTable, createPage, incrementViews };
