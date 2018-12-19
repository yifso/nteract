import Kernel from "../src/kernel";

describe("Kernel", () => {
  it("can launch a kernel given a name", async () => {
    const kernel = new Kernel("python3");
    await kernel.launch();
    expect(kernel.launchedKernel).toBeDefined();
  });
  it("can shutdown a kernel", async () => {
    const kernel = new Kernel("python3");
    await kernel.launch();
    expect(kernel.launchedKernel).toBeDefined();
    await kernel.shutdown();
    expect(kernel.launchedKernel).toBeUndefined();
  });
  it("can get usage metrics on a kernel", async () => {
    const kernel = new Kernel("python3");
    await kernel.launch();
    const stats = await kernel.getUsage();
    expect(stats.memory).toBeDefined();
    expect(stats.pid).toEqual(kernel.launchedKernel.spawn.pid);
  });
});
