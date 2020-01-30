// Vendor modules
import * as actions from "@nteract/actions";
import { ConfigState } from "@nteract/types";
import { Map } from "immutable";

type ConfigAction =
  | actions.SetConfigAction<any>
  | actions.MergeConfigAction
  | actions.ConfigLoadedAction;

export function setConfigAtKey(
  state: ConfigState,
  action: actions.SetConfigAction<any>
): Map<string, any> {
  const { key, value } = action.payload;
  return state.set(key, value);
}

export function mergeConfig(
  state: ConfigState,
  action: actions.MergeConfigAction | actions.ConfigLoadedAction
): Map<string, any> {
  const { config } = action.payload;
  return state.merge(config);
}

export default function handleConfig(
  state: ConfigState = Map(),
  action: ConfigAction
): Map<string, any> {
  switch (action.type) {
    case actions.SET_CONFIG_AT_KEY:
      return setConfigAtKey(state, action);
    case actions.MERGE_CONFIG:
    case actions.CONFIG_LOADED:
      return mergeConfig(state, action);
    default:
      return state;
  }
}
