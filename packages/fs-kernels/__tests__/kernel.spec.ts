import Kernel from "../src/kernel";

describe("Kernel", () => {
  it("can launch a kernel given a name", async done => {
    const kernel = new Kernel("python3");
    await kernel.launch();
    expect(kernel.launchedKernel).toBeDefined();
    done();
  });
  it("can shutdown a kernel", async done => {
    const kernel = new Kernel("python3");
    await kernel.launch();
    expect(kernel.launchedKernel).toBeDefined();
    await kernel.shutdown();
    expect(kernel.launchedKernel).toBeUndefined();
    done();
  });
  it("can get usage metrics on a kernel", async done => {
    const kernel = new Kernel("python3");
    await kernel.launch();
    const stats = await kernel.getUsage();
    expect(stats.memory).toBeDefined();
    expect(stats.pid).toEqual(kernel.launchedKernel.spawn.pid);
    done();
  });
});
