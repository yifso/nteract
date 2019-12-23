import Immutable from "immutable";
import { AnyAction } from "redux";
import * as actions from "./actions";

export default function webApp(
  state: WebAppState = Immutable.Map(),
  action: AnyAction
) {
  switch (action.type) {
    case actions.CHANGE_GIT_REF:
      return state.set("gitRef", action.payload.gitRef);
    case actions.CHANGE_REPO:
      return state.set("repo", action.payload.repo);
    case actions.TOGGLE_SHOW_PANEL:
      return state.set("showPanel", action.payload.showPanel);
    default:
      return state;
  }
}
