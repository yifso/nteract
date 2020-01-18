// Vendor modules
import * as actions from "@nteract/actions";
import { makeStateRecord } from "@nteract/types";
import { Action } from "redux";
import { combineReducers } from "redux-immutable";

// Local modules
import { entities } from "./entities";

const currentKernelspecsRef = (state = "", action: Action) => {
  switch (action.type) {
    case actions.FETCH_KERNELSPECS:
      const typedAction = action as actions.FetchKernelspecs;
      return typedAction.payload.kernelspecsRef;
    default:
      return state;
  }
};

const core = combineReducers(
  {
    currentKernelspecsRef,
    entities
  },
  makeStateRecord as any
);

export default core;
