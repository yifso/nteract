import Immutable from "immutable";
import { combineReducers } from "redux-immutable";

import * as actions from "@nteract/actions";
import { makeTransformsRecord } from "@nteract/types";

const transforms = (
  state = Immutable.List(),
  action: actions.AddTransform | actions.RemoveTransform
) => {
  switch (action.type) {
    case actions.ADD_TRANSFORM:
      return state.push(action.payload.component);
    case actions.REMOVE_TRANSFORM:
      return state.delete(action.payload.component);
    default:
      return state;
  }
};

const byId = (
  state = Immutable.Map(),
  action: actions.AddTransform | actions.RemoveTransform
) => {
  switch (action.type) {
    case actions.ADD_TRANSFORM:
      return state.set(action.payload.mediaType, action.payload.component);
    case actions.REMOVE_TRANSFORM:
      return state.delete(action.payload.mediaType);
    default:
      return state;
  }
};

export const modals = combineReducers(
  { transforms, byId },
  makeTransformsRecord as any
);
