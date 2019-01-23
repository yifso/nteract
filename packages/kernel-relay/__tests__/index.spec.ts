import { gql } from "apollo-server";
import { createTestClient } from "apollo-server-testing";
import { server } from "../src";

describe("Queries", () => {
  it("returns a list of kernelspecs", async () => {
    const { query } = createTestClient(server);
    const LIST_KERNELSPECS = gql`
      query GetKernels {
        listKernelSpecs {
          name
        }
      }
    `;
    const response = await query({ query: LIST_KERNELSPECS });
    expect(response).not.toBeNull();
    expect(response.data.listKernelSpecs.length).toBeGreaterThan(0);
  });
});

describe("Mutations", () => {
  let kernelId;
  it("launches a kernel", async () => {
    const { mutate } = createTestClient(server);
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

    expect(response).not.toBeNull();
    expect(response.data.startKernel.status).toBe("launched");
  });
  it("shuts down a kernel", async () => {
    const { mutate } = createTestClient(server);
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
    expect(response).not.toBeNull();
    expect(response.data.shutdownKernel.status).toBe("shutdown");
  });
});
