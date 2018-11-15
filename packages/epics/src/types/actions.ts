export const LAUNCH_KERNEL_SUCCESSFUL = "LAUNCH_KERNEL_SUCCESSFUL";
export type NewKernelAction = {
  type: "LAUNCH_KERNEL_SUCCESSFUL",
  payload: {
    kernel: LocalKernelProps | RemoteKernelProps,
    kernelRef: KernelRef,
    contentRef: ContentRef,
    selectNextKernel: boolean
  }
};