import { Kernelspecs } from "@nteract/types";

import { QuittingState } from "./reducers";

export function setKernelSpecs(kernelSpecs: Kernelspecs) {
  return {
    type: "SET_KERNELSPECS",
    kernelSpecs: kernelSpecs
  };
}

export function setQuittingState(newState: QuittingState) {
  return {
    type: "SET_QUITTING_STATE",
    newState: newState
  };
}
