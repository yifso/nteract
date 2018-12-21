import { launchKernel } from "../src/kernel";

jest.unmock("process");

describe("Kernel", () => {
  it("can launch a kernel given a name", async done => {
    const kernel = await launchKernel("python3");
    expect(kernel.process).toBeDefined();
    await kernel.shutdown();
    done();
  });
  it("can shutdown a kernel", async done => {
    const kernel = await launchKernel("python3");
    process.kill = jest.fn();
    expect(kernel.process).toBeDefined();
    await kernel.shutdown();
    expect(process.kill).toBeCalledWith(kernel.process.pid);
    expect(process.kill).toBeCalledTimes(1);
    done();
  });
  it("can get usage metrics on a kernel", async done => {
    const kernel = await launchKernel("python3");
    const stats = await kernel.getUsage();
    expect(stats.memory).toBeDefined();
    expect(stats.pid).toEqual(kernel.process.pid);
    await kernel.shutdown();
    done();
  });
});
