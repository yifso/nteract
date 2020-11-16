import { HasPrivateConfigurationState } from "@nteract/mythic-configuration";
import { Kernelspecs } from "@nteract/types";
import { RecordOf } from "immutable";

import { QuittingState, SetQuittingStateAction } from "./actions";
import { SetKernelspecs } from "./kernel-specs";

export interface MainStateProps extends HasPrivateConfigurationState {
  kernelSpecs: Kernelspecs;
  quittingState: QuittingState;
}

export type MainStateRecord = RecordOf<MainStateProps>;

export type MainAction =
  | SetKernelspecs
  | SetQuittingStateAction
  ;
