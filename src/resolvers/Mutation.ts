const USERS = "Users";

const createUsersTable = async (obj, args, context, info) => {
  const { dynamodb } = context;

  const params = {
    TableName: USERS,
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" },
      { AttributeName: "username", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "N" },
      { AttributeName: "username", AttributeType: "S" }
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

const createUser = async (obj, args, context, info) => {
  const { id, username } = args;
  const { docClient } = context;
  const created_on = Date.now();
  const params = {
    TableName: USERS,
    Item: {
      id: id,
      username: username,
      attributes: {
        created_on,
        updated_on: null
      }
    }
  };
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
    .then(result => {
      return result;
    });
};

const rateUser = async (obj, args, context, info) => {
  const { id, username, rating } = args;
  const { docClient } = context;
  const params = {
    TableName: USERS,
    Key: {
      id,
      username
    },
    UpdateExpression: "set attributes.rating = :r, attributes.updated_on= :u",
    ExpressionAttributeValues: {
      ":r": rating,
      ":u": Date.now()
    },
    ReturnValues: "UPDATED_NEW"
  };
  return docClient
    .update(params, function(err, data) {
      if (err) {
        console.error(
          "Unable to update item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
    })
    .promise()
    .then(res => {
      console.log("res", res);
      return res;
    });
};

export default { createUsersTable, createUser, rateUser };
