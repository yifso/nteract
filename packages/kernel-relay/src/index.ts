import { ApolloServer, gql } from "apollo-server";

import { findAll } from "@nteract/fs-kernels";

const Types = gql`
  type KernelSpec {
    id: ID!
    name: String
  }
`;

const Query = gql`
  type Query {
    listKernelSpecs: [KernelSpec!]!
  }
`;

const typeDefs = [Types, Query];
const resolvers = {
  Query: {
    listKernelSpecs: async () => {
      const kernelspecs = await findAll();
      console.log(kernelspecs);
      debugger;

      return Object.keys(kernelspecs).map(key => kernelspecs[key]);
    }
  }
};

const mocks = {
  // By default we'll do empty objects for the JSON Scalar
  JSON: () => ({})
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // mocks,
  // mockEntireSchema: false,
  // Since we're playing around, enable features for introspection and playing on our current deployment
  // If this gets used in a "real" production capacity, introspection and playground should be disabled
  // based on NODE_ENV === "production"
  introspection: true,
  playground: {
    /*tabs: [
      {
        endpoint: "",
        query: ``
      }
    ]*/
  }
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
