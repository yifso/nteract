// Vendor modules
import * as actions from "@nteract/actions";
import {
  makeHostsRecord,
  makeJupyterHostRecord,
  makeLocalHostRecord
} from "@nteract/types";
import { List, Map } from "immutable";
import { Action, Reducer } from "redux";
import { combineReducers } from "redux-immutable";

const byRef = (state = Map(), action: Action): Map<{}, {}> => {
  let typedAction;
  switch (action.type) {
    case actions.ADD_HOST:
      typedAction = action as actions.AddHost;
      switch (typedAction.payload.host.type) {
        case "jupyter": {
          return state.set(
            typedAction.payload.hostRef,
            makeJupyterHostRecord(typedAction.payload.host)
          );
        }
        case "local": {
          return state.set(
            typedAction.payload.hostRef,
            makeLocalHostRecord(typedAction.payload.host)
          );
        }
        default:
          throw new Error(
            `Unrecognized host type "${typedAction.payload.host.type}".`
          );
      }
    default:
      return state;
  }
};

const refs = (state = List(), action: Action): List<any> => {
  let typedAction;
  switch (action.type) {
    case actions.ADD_HOST:
      typedAction = action as actions.AddHost;
      return state.push(typedAction.payload.hostRef);
    default:
      return state;
  }
};

export const hosts: Reducer<
  {
    byRef: Map<{}, {}>;
    refs: List<any>;
  },
  Action<any>
> = combineReducers({ byRef, refs }, makeHostsRecord as any);
