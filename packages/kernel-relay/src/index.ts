import { ApolloServer, gql } from "apollo-server";

import { findAll, Kernel, launchKernel } from "@nteract/fs-kernels";

import { JupyterMessage, kernelInfoRequest } from "@nteract/messaging";

import GraphQLJSON from "graphql-type-json";

const Types = gql`
  scalar JSON

  type KernelSpec {
    id: ID!
    name: String
  }

  type KernelSession {
    id: ID!
    status: String
  }

  type Message {
    id: ID!
    payload: JSON
  }
`;

const Query = gql`
  type Query {
    listKernelSpecs: [KernelSpec!]!
    running: [KernelSession!]!
    messages: [Message!]!
  }
`;

const Mutation = gql`
  type Mutation {
    startKernel(name: String): KernelSession!
  }
`;

interface StartKernel {
  name: string;
}

const kernels: { [id: string]: Kernel } = {};

const messages: {
  [kernelId: string]: JupyterMessage[];
} = {};

const typeDefs = [Types, Query, Mutation];
const resolvers = {
  JSON: GraphQLJSON,
  Mutation: {
    startKernel: async (parentValue: any, args: StartKernel) => {
      const kernel = await launchKernel(args.name);

      console.log(`kernel ${args.name}:${kernel.connectionInfo.key} launched`);

      // NOTE: we should generate IDs
      // We're also setting a session ID within the enchannel-zmq setup, I wonder
      // if we should use that
      const id = kernel.connectionInfo.key;

      messages[id] = [];
      kernels[id] = kernel;

      const subscription = kernel.channels.subscribe(
        (message: JupyterMessage) => {
          messages[id].push(message);
        }
      );

      const request = kernelInfoRequest();
      messages[id].push(request);
      kernel.channels.next(request);

      // NOTE: We are going to want to both:
      //
      //   subscription.unsubscribe()
      //   AND
      //   kernel.channels.complete()
      //
      //   Within our cleanup code

      return {
        id,
        status: "launched"
      };
    }
  },
  Query: {
    listKernelSpecs: async () => {
      const kernelspecs = await findAll();

      return Object.keys(kernelspecs).map(key => {
        return {
          id: key,
          ...kernelspecs[key]
        };
      });
    },
    messages: () => {
      return ([] as Array<JupyterMessage>)
        .concat(...Object.values(messages))
        .map(message => ({ id: message.header.msg_id, payload: message }));
    },
    running: () => {
      return Object.keys(kernels).map(id => ({ id, status: "pretend" }));
    }
  }
};

async function main() {
  // In the most basic sense, the ApolloServer can be started
  // by passing type definitions (typeDefs) and the resolvers
  // responsible for fetching the data for those types.
  const server = new ApolloServer({
    introspection: true,
    // Since we're playing around, enable features for introspection and playing on our current deployment
    // If this gets used in a "real" production capacity, introspection and playground should be disabled
    // based on NODE_ENV === "production"
    playground: {
      /*tabs: [
        {
          endpoint: "",
          query: ``
        }
      ]*/
    },
    resolvers: resolvers as any,
    typeDefs
  });

  // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

process.on("exit", () => {
  Object.keys(kernels).map(async id => {
    console.log("shutting down ", id);
    await kernels[id].shutdown();
  });
});

main();
