import { AppState, KernelRef, KernelStatus } from "@nteract/types";

/**
 * Returns a map of the available kernels keyed by the
 * kernel ref.
 *
 * @param   state   The state of the nteract application
 *
 * @returns         The kernels by ref
 */
export const kernelsByRef = (state: AppState) =>
  state.core.entities.kernels.byRef;

/**
 * Returns the kernel associated with a given KernelRef.
 *
 * @param   state                   The state of the nteract application
 * @param   { kernelRef: KernelRef} An object containing the KernelRef
 *
 * @returns                         The kernel for the KernelRef
 */
export const kernel = (
  state: AppState,
  { kernelRef }: { kernelRef?: KernelRef }
) => {
  return kernelRef ? kernelsByRef(state).get(kernelRef, null) : null;
};

/**
 * Returns the type of a kernel given the kernelRef.
 */
export const kernelType = (
  state: AppState,
  { kernelRef }: { kernelRef: KernelRef }
) => {
  const targetKernel = kernel(state, { kernelRef });
  return targetKernel?.type;
};

/**
 * Returns the status of a kernel given its kernelRef.
 */
export const kernelStatus = (
  state: AppState,
  { kernelRef }: { kernelRef: KernelRef }
) => {
  const targetKernel = kernel(state, { kernelRef });
  return targetKernel?.status || KernelStatus.NotConnected;
};
