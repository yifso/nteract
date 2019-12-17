// tslint:disable:max-line-length
import { Action, makeActionFunction } from "../utils";

// FIXME: probably belongs somewhere else
interface ConfigPayload {
  config: {
    [key: string]: string;
  };
}

export const LOAD_CONFIG            = "LOAD_CONFIG";
export const SAVE_CONFIG            = "SAVE_CONFIG";
export const DONE_SAVING_CONFIG     = "DONE_SAVING_CONFIG";
export const MERGE_CONFIG           = "MERGE_CONFIG";
export const SET_CONFIG_AT_KEY      = "SET_CONFIG_AT_KEY";

export type LoadConfigAction        = Action<typeof LOAD_CONFIG>;                                      // FIXME: Name inconsistent
export type SaveConfigAction        = Action<typeof SAVE_CONFIG>;                                      // FIXME: Name inconsistent
export type DoneSavingConfigAction  = Action<typeof DONE_SAVING_CONFIG>;                               // FIXME: Name inconsistent
export type MergeConfigAction       = Action<typeof MERGE_CONFIG,         ConfigPayload>;              // FIXME: Name inconsistent
export type SetConfigAction     <T> = Action<typeof SET_CONFIG_AT_KEY,    { key: string; value: T }>;  // FIXME: Name inconsistent

export const loadConfig             = makeActionFunction<LoadConfigAction>      (LOAD_CONFIG);
export const saveConfig             = makeActionFunction<SaveConfigAction>      (SAVE_CONFIG);
export const doneSavingConfig       = makeActionFunction<DoneSavingConfigAction>(DONE_SAVING_CONFIG);
export const mergeConfig            = makeActionFunction<MergeConfigAction>     (MERGE_CONFIG);
export const setConfigAtKey         = <T>(key: string, value: T) => makeActionFunction<SetConfigAction<T>>(SET_CONFIG_AT_KEY)({key, value});
export const setTheme               = (theme: string) => setConfigAtKey("theme", theme);
export const setCursorBlink         = (value: string) => setConfigAtKey("cursorBlinkRate", value);
