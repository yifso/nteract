import { combineReducers } from "redux-immutable";
import * as Immutable from "immutable";

import {
  makeContentCommunicationRecord,
  makeContentsCommunicationRecord
} from "@nteract/types";
import * as actions from "@nteract/actions";

const byRef = (state = Immutable.Map(), action) => {
  switch (action.type) {
    case actions.FETCH_CONTENT:
      return state.set(
        action.payload.contentRef,
        makeContentCommunicationRecord({
          loading: true,
          saving: false,
          error: null
        })
      );
    case actions.FETCH_CONTENT_FULFILLED:
      return state.set(
        action.payload.contentRef,
        makeContentCommunicationRecord({
          loading: false,
          saving: false,
          error: null
        })
      );
    case actions.FETCH_CONTENT_FAILED:
      return state.set(
        action.payload.contentRef,
        makeContentCommunicationRecord({
          loading: false,
          saving: false,
          error: action.payload.error
        })
      );
    case actions.SAVE:
    case actions.SAVE_AS:
      return state.set(
        action.payload.contentRef,
        makeContentCommunicationRecord({
          loading: false,
          saving: true,
          error: null
        })
      );
    case actions.SAVE_FULFILLED:
      return state.set(
        action.payload.contentRef,
        makeContentCommunicationRecord({
          loading: false,
          saving: false,
          error: null
        })
      );
    case actions.SAVE_FAILED:
      return state.set(
        action.payload.contentRef,
        makeContentCommunicationRecord({
          loading: false,
          saving: false,
          error: action.payload.error
        })
      );
    default:
      return state;
  }
};

export const contents = combineReducers(
  { byRef },
  makeContentsCommunicationRecord
);
