// server/schemas/index.js
const userResolvers = require('./userResolvers');
const riotResolvers = require('./riotResolvers');
const typeDefs = require('./typeDefs');

// Combine all resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...riotResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};

module.exports = { typeDefs, resolvers };