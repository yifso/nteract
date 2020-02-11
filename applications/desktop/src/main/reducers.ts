import { Kernelspecs } from "@nteract/types";
import { Record, RecordOf } from "immutable";

import { QUITTING_STATE_NOT_STARTED, QuittingState, SetKernelSpecsAction, SetQuittingStateAction } from "./actions";

interface MainStateProps {
  kernelSpecs: Kernelspecs;
  quittingState: QuittingState;
}

export type MainStateRecord = RecordOf<MainStateProps>;

const makeMainStateRecord = Record<MainStateProps>({
  kernelSpecs: {},
  quittingState: QUITTING_STATE_NOT_STARTED
});

function setKernelSpecs(
  state: MainStateRecord,
  action: SetKernelSpecsAction,
): MainStateRecord {
  return state.set("kernelSpecs", action.payload.kernelSpecs);
}

function setQuittingState(
  state: MainStateRecord,
  action: SetQuittingStateAction,
): MainStateRecord {
  return state.set("quittingState", action.payload.newState);
}

export type MainAction =
  | SetKernelSpecsAction
  | SetQuittingStateAction;

export default function rootReducer(
  state: MainStateRecord = makeMainStateRecord(),
  action: MainAction,
): MainStateRecord {
  switch (action.type) {
    case "SET_KERNELSPECS":
      return setKernelSpecs(state, action);
    case "SET_QUITTING_STATE":
      return setQuittingState(state, action);
    default:
      return state;
  }
}
