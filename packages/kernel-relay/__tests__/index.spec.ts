import { gql } from "apollo-server";
import { createTestClient } from "apollo-server-testing";
import { createServer } from "../src/server";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "kernel1")
}));

describe("Queries", () => {
  it("returns a list of kernelspecs", async () => {
    const { query } = createTestClient(createServer());
    const LIST_KERNELSPECS = gql`
      query GetKernels {
        listKernelSpecs {
          name
        }
      }
    `;
    const response = await query({ query: LIST_KERNELSPECS });
    expect(response).toMatchSnapshot();
  });
});

describe("Mutations", () => {
  let kernelId;
  it("launches a kernel", async () => {
    const { mutate } = createTestClient(createServer());
    const START_KERNEL = gql`
      mutation StartJupyterKernel {
        startKernel(name: "python3") {
          id
          status
        }
      }
    `;
    const response = await mutate({ mutation: START_KERNEL });
    kernelId = response.data.startKernel.id;

    expect(response).toMatchSnapshot();
  });
  it("shuts down a kernel", async () => {
    const { mutate } = createTestClient(createServer());
    const SHUTDOWN_KERNEL = gql`
      mutation KillJupyterKernel($id: ID) {
        shutdownKernel(id: $id) {
          id
          status
        }
      }
    `;
    const response = await mutate({
      mutation: SHUTDOWN_KERNEL,
      variables: { id: kernelId }
    });

    expect(response).toMatchSnapshot();
  });
});
