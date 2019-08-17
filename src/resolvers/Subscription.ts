import { USERS, USER_ADDED, USER_UPDATED } from "./index";

const userAdded = {
  // Additional event labels can be passed to asyncIterator creation
  subscribe: (obj, args, context, info) => {
    const { pubsub } = context;
    return pubsub.asyncIterator([USER_ADDED]);
  }
};

export default { userAdded };
