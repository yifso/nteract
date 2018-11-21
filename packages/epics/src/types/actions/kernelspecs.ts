import { HostRef, KernelspecsRef } from "../refs";

type KernelspecProps = {
    name: string,
    argv: List<string>,
    env: Map<string, *>,
    interruptMode: ?string,
    language: string,
    displayName: string,
    resources: Map<string, *>,
    metadata: Map<string, *>
  };  

export const FETCH_KERNELSPECS = "CORE/FETCH_KERNELSPECS";
export type FetchKernelspecs = {
  type: "CORE/FETCH_KERNELSPECS",
  payload: {
    kernelspecsRef: KernelspecsRef,
    hostRef: HostRef
  }
};

export const FETCH_KERNELSPECS_FULFILLED = "CORE/FETCH_KERNELSPECS_FULFILLED";
export type FetchKernelspecsFulfilled = {
  type: "CORE/FETCH_KERNELSPECS_FULFILLED",
  payload: {
    kernelspecsRef: KernelspecsRef,
    hostRef: HostRef,
    defaultKernelName: string,
    kernelspecs: { [key: string]: KernelspecProps }
  }
};

export const FETCH_KERNELSPECS_FAILED = "CORE/FETCH_KERNELSPECS_FAILED";
export type FetchKernelspecsFailed = {
  type: "CORE/FETCH_KERNELSPECS_FAILED",
  payload: {
    kernelspecsRef: KernelspecsRef,
    error: Object
  }
};