import { Map as ImmutableMap } from "immutable";

import { ConfigState } from "@nteract/types";
import { SetConfigAction, MergeConfigAction } from "@nteract/actions";

type ConfigAction = SetConfigAction<any> | MergeConfigAction;

export function setConfigAtKey(
  state: ConfigState,
  action: SetConfigAction<any>
) {
  const { key, value } = action;
  return state.set(key, value);
}

export function mergeConfig(state: ConfigState, action: MergeConfigAction) {
  const { config } = action;
  return state.merge(config);
}

export default function handleConfig(
  state: ConfigState = ImmutableMap(),
  action: ConfigAction
) {
  switch (action.type) {
    case "SET_CONFIG_AT_KEY":
      return setConfigAtKey(state, action);
    case "MERGE_CONFIG":
      return mergeConfig(state, action);
    default:
      return state;
  }
}
