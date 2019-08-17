const USER_ADDED = "USER_ADDED";

const userAdded = {
  // Additional event labels can be passed to asyncIterator creation
  subscribe: (obj, args, context, info) => {
    const { pubsub } = context;
    return pubsub.asyncIterator([USER_ADDED]);
  }
};

export default { userAdded };
