import Immutable from "immutable";
import { Action } from "redux";
import { combineReducers } from "redux-immutable";

import * as actions from "@nteract/actions";
import { makeTransformsRecord } from "@nteract/types";

const handlers = (state = Immutable.List(), action: Action) => {
  let typedAction;
  switch (action.type) {
    case actions.ADD_TRANSFORM:
      typedAction = action as actions.AddTransform;
      return state.push(typedAction.payload.component);
    case actions.REMOVE_TRANSFORM:
      typedAction = action as actions.RemoveTransform;
      return state.delete(typedAction.payload.component);
    default:
      return state;
  }
};

const byId = (state = Immutable.Map(), action: Action) => {
  let typedAction;
  switch (action.type) {
    case actions.ADD_TRANSFORM:
      typedAction = action as actions.AddTransform;
      return state.set(
        typedAction.payload.mediaType,
        typedAction.payload.component
      );
    case actions.REMOVE_TRANSFORM:
      typedAction = action as actions.RemoveTransform;
      return state.delete(typedAction.payload.mediaType);
    default:
      return state;
  }
};

const displayOrder = (state = Immutable.List(), action: Action) => {
  let typedAction;
  switch (action.type) {
    case actions.ADD_TRANSFORM:
      typedAction = action as actions.AddTransform;
      return state.push(typedAction.payload.mediaType);
    case actions.REMOVE_TRANSFORM:
      typedAction = action as actions.RemoveTransform;
      return state.delete(state.indexOf(typedAction.payload.mediaType));
    default:
      return state;
  }
};

export const transforms = combineReducers(
  { handlers, byId, displayOrder },
  makeTransformsRecord as any
);
