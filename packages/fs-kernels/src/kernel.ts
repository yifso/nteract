/**
 * @module fs-kernels
 */
import { launch, launchSpec, LaunchedKernel, cleanup } from "./spawnteract";
import pidusage from "pidusage";
import { KernelSpec } from "./kernelspecs";

export default class Kernel {
  name?: string;
  kernelSpec?: KernelSpec;
  launchedKernel?: LaunchedKernel;

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
    } else if (this.kernelSpec && !this.name) {
      launchedKernel = await launchSpec(this.kernelSpec);
    }

    this.launchedKernel = launchedKernel;
  }

  async shutdown() {
    if (this.launchedKernel) {
      cleanup(this.launchedKernel.connectionFile);
      if (!this.launchedKernel.spawn.killed && this.launchedKernel.spawn.pid) {
        process.kill(this.launchedKernel.spawn.pid);
      }
      this.launchedKernel.spawn.removeAllListeners();
      this.launchedKernel = undefined;
    }
  }

  async getUsage() {
    if (this.launchedKernel) {
      const pid = this.launchedKernel.spawn.pid;
      return await pidusage(pid);
    }
  }
}
