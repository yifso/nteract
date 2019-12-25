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
    case actions.ADD_SERVER_MSG:
      const logs = state.get("logs", Immutable.List());
      if (logs.size === 0) {
        return state.set("logs", Immutable.List([action.payload.message]));
      } else {
        return state.set("logs", logs.push(action.payload.message));
      }
    default:
      return state;
  }
}
