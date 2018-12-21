import { ApolloServer, gql } from "apollo-server";

import { findAll, launchKernel, Kernel } from "@nteract/fs-kernels";

const Types = gql`
  type KernelSpec {
    id: ID!
    name: String
  }

  type KernelSession {
    id: ID!
    status: String
  }
`;

const Query = gql`
  type Query {
    listKernelSpecs: [KernelSpec!]!
    running: [KernelSession!]!
  }
`;

const Mutation = gql`
  type Mutation {
    startKernel(name: String): KernelSession!
  }
`;

type StartKernel = {
  name: string;
};

const kernels: { [id: string]: Kernel } = {};

const typeDefs = [Types, Query, Mutation];
const resolvers = {
  Query: {
    listKernelSpecs: async () => {
      const kernelspecs = await findAll();

      return Object.keys(kernelspecs).map(key => {
        return { id: key, ...kernelspecs[key] };
      });
    },
    running: () => {
      return Object.keys(kernels).map(id => ({ id, status: "pretend" }));
    }
  },
  Mutation: {
    startKernel: async (_parentValue: any, args: StartKernel) => {
      /**
       *
       * const kernel
       *
       *
       */

      const kernel = await launchKernel(args.name);

      kernels[kernel.connectionInfo.key] = kernel;
      return {
        id: kernel.connectionInfo.key,
        status: "launched"
      };
    }
  }
};

async function main() {
  const mocks = {
    // By default we'll do empty objects for the JSON Scalar
    JSON: () => ({})
  };

  // In the most basic sense, the ApolloServer can be started
  // by passing type definitions (typeDefs) and the resolvers
  // responsible for fetching the data for those types.
  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers as any,
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
}

main();

process.on("exit", () => {
  Object.keys(kernels).map(async id => {
    await kernels[id].shutdown();
  });
});
