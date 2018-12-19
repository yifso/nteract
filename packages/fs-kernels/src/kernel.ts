import { launch, launchSpec, LaunchedKernel, cleanup } from "./spawnteract";
import pidusage from "pidusage";
import { KernelSpec } from "./kernelspecs";

export default class Kernel {
  name?: string;
  kernelSpec?: KernelSpec;
  launchedKernel: LaunchedKernel;

  constructor(input: string | KernelSpec) {
    if (typeof input === "string") {
      this.name = input;
    } else {
      this.kernelSpec = input;
    }
  }

  async launch() {
    let launchedKernel;
    if (this.name && !this.kernelSpec) {
      launchedKernel = await launch(this.name);
    } else {
      launchedKernel = await launchSpec(this.kernelSpec);
    }

    this.launchedKernel = launchedKernel;
  }

  async shutdown() {
    this.launchedKernel.spawn.kill();
    cleanup(this.launchedKernel.connectionFile);
  }

  async getUsage() {
    const pid = this.launchedKernel.spawn.pid;
    return await pidusage(pid);
  }
}
