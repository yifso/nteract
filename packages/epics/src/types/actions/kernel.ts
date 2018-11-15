import { ContentRef, KernelRef } from "../refs";

export const LAUNCH_KERNEL_SUCCESSFUL = "LAUNCH_KERNEL_SUCCESSFUL";
export interface NewKernelAction {
  type: "LAUNCH_KERNEL_SUCCESSFUL",
  payload: {
    kernel: LocalKernelProps | RemoteKernelProps,
    kernelRef: KernelRef,
    contentRef: ContentRef,
    selectNextKernel: boolean
  }
};

export const COMM_OPEN = "COMM_OPEN";
export type CommOpenAction = {
  type: "COMM_OPEN",
  target_name: string,
  target_module: string,
  data: any,
  comm_id: string
};

export const COMM_MESSAGE = "COMM_MESSAGE";
export type CommMessageAction = {
  type: "COMM_MESSAGE",
  data: any,
  comm_id: string
};