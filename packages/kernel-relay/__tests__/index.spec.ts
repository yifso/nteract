import { gql } from "apollo-server";
import { createTestClient } from "apollo-server-testing";

import { server } from "../src";
import { QueryDocumentKeys } from "graphql/language/visitor";

describe("listKernelSpecs", () => {
    it("lists the kernelspecs available on a server", async () => {
        const { query } = createTestClient(server);
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

describe("running", () => {
    it("list no running kernels when none are running", async () => {
        const { query } = createTestClient(server);
        const testQuery = gql`
            query queryRunning {
                running {
                    id
                    status
                }
            }
        `;
        const response = await query({ query: testQuery });

        expect(response.errors).toBeUndefined();
        expect(response.data.running.length).toEqual(0);
    })
});

describe("startKernel", () => {
    it("starts the kernel without failure", async () => {
        const { mutate } = createTestClient(server);
    const testMutation = gql`
        muation queryStartKernel {
            startKernel(name: "python3") {
                id,
                status
            }
        }
    `;
    const response = await mutate({ mutation: testMutation })

    })
    
});