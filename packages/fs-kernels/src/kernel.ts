/**
 * @module fs-kernels
 */
import { ExecaChildProcess } from "execa";
import pidusage from "pidusage";

import { Channels } from "@nteract/messaging";

import { JupyterConnectionInfo } from "enchannel-zmq-backend";

import { KernelSpec } from "./kernelspecs";
import { cleanup, launch, LaunchedKernel, launchSpec } from "./spawnteract";

interface Usage {
  /**
   * percentage (from 0 to 100*vcore)
   */
  cpu: number;

  /**
   * bytes
   */
  memory: number;

  /**
   * PPID
   */
  ppid: number;

  /**
   * PID
   */
  pid: number;

  /**
   * ms user + system time
   */
  ctime: number;

  /**
   * ms since the start of the process
   */
  elapsed: number;

  /**
   * ms since epoch
   */
  timestamp: number;
}

export class Kernel {
  kernelSpec: KernelSpec;
  process: ExecaChildProcess;
  connectionInfo: JupyterConnectionInfo;
  connectionFile: string;
  channels: Channels;

  constructor(launchedKernel: LaunchedKernel) {
    this.process = launchedKernel.spawn;
    this.connectionInfo = launchedKernel.config;
    this.kernelSpec = launchedKernel.kernelSpec;
    this.connectionFile = launchedKernel.connectionFile;
    this.channels = launchedKernel.channels;
  }

  async shutdown() {
    cleanup(this.connectionFile);
    if (!this.process.killed && this.process.pid) {
      process.kill(this.process.pid);
    }
    this.process.removeAllListeners();
  }

  async getUsage(): Promise<Usage> {
    return await pidusage(this.process.pid);
  }
}

export async function launchKernel(input: string | KernelSpec) {
  let launchedKernel;
  if (typeof input === "string") {
    launchedKernel = await launch(input);
  } else {
    launchedKernel = await launchSpec(input);
  }
  return new Kernel(launchedKernel);
}
