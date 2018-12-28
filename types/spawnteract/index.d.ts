declare module "spawnteract" {
  import { ChildProcess, SpawnOptions } from "child_process";
  import { JupyterConnectionInfo } from "enchannel-zmq-backend";

  // NOTE: There are other definitions, feel free to add more as we need them
  //       until we switch to @nteract/fs-kernels
  export function launchSpec(
    kernelspec: object,
    spawnOptions: SpawnOptions
  ): Promise<{
    spawn: ChildProcess;
    connectionFile: string;
    config: JupyterConnectionInfo;
    kernelspec: object;
  }>;
}
