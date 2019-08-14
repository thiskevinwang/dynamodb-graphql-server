const USERS = "Users";

const getUser = async (obj, args, context, info) => {
  const { username, id }: { username: string; id: number } = args;
  const { docClient } = context;
  const params = {
    TableName: USERS,
    Key: {
      id: id,
      username: username
    }
  };
  return docClient
    .get(params, function(err, data) {
      if (err) {
        console.error(
          "Unable to get item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        // console.log("getItem succeeded:", JSON.stringify(data, null, 2));
      }
    })
    .promise()
    .then(res => {
      console.log(res);
      /**
       * TO AVOID THIS, YOU CAN DO
       */
      // const { Item } = res;
      // return {
      //   attributes: Item.attributes },
      //   id: Item.id,
      //   username: Item.username
      // };
      /**
       * THIS
       */
      const { Item: User } = res;
      return User;
    });
};

const getUsers = async (obj, args, context, info) => {
  const table = USERS;
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
    .scan(params, function(err, data) {
      if (err) {
        console.error(
          "Unable to update item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        // console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
    })
    .promise()
    .then(result => {
      console.log("result", result);
      const { Items, Count, ScannedCount } = result;
      // Restructure the dynamodb response for better graphql handling
      return { Users: Items, Count, ScannedCount };
    });
};

export default { getUser, getUsers };
