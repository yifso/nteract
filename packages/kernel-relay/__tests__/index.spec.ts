import { gql } from "apollo-server";
import { createTestClient } from "apollo-server-testing";
import { server } from "../src";

describe("Queries", () => {
  it("returns a list of kernelspecs", async () => {
    const { query } = createTestClient(server);
    const kernelspecsQuery = gql`
      query GetKernels {
        listKernelSpecs {
          name
        }
      }
    `;
    const response = await query({ query: kernelspecsQuery });
    expect(response).not.toBeNull();
    expect(response.data.listKernelSpecs.length).toBeGreaterThan(0);
  });
});
