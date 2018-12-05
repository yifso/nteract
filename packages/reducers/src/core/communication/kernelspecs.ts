import { combineReducers } from "redux-immutable";
import * as Immutable from "immutable";

import {
  makeKernelspecsByRefCommunicationRecord,
  makeKernelspecsCommunicationRecord
} from "@nteract/types";
import * as actionTypes from "@nteract/actions";

export const byRef = (
  state = Immutable.Map(),
  action:
    | actionTypes.FetchKernelspecs
    | actionTypes.FetchKernelspecsFulfilled
    | actionTypes.FetchKernelspecsFailed
) => {
  switch (action.type) {
    case actionTypes.FETCH_KERNELSPECS:
      return state.set(
        action.payload.kernelspecsRef,
        makeKernelspecsByRefCommunicationRecord({ loading: true, error: null })
      );
    case actionTypes.FETCH_KERNELSPECS_FULFILLED:
      return state.set(
        action.payload.kernelspecsRef,
        makeKernelspecsByRefCommunicationRecord({ loading: false, error: null })
      );
    case actionTypes.FETCH_KERNELSPECS_FAILED:
      return state.set(
        action.payload.kernelspecsRef,
        makeKernelspecsByRefCommunicationRecord({
          loading: false,
          error: action.payload.error
        })
      );
    default:
      return state;
  }
};

export const kernelspecs = combineReducers(
  { byRef },
  makeKernelspecsCommunicationRecord
);
