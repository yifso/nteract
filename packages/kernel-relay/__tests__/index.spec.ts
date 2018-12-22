import { gql } from "apollo-server";
import { createTestClient } from "apollo-server-testing";

import { server } from "../src";

const { query, mutate } = createTestClient(server);

describe("listKernelSpecs", () => {
    it("lists the kernelspecs available on a server", async () => {
        const testQuery = gql`
            query queryListKernelSpecs {
                listKernelSpecs {
                    id
                    name
                }
            }
        `;
        const response = await query({query: testQuery});

        expect(response.errors).toBeUndefined();
        expect(response.data.listKernelSpecs.length).toBeGreaterThan(0);
    })
})