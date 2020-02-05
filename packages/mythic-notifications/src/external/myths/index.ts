import { Record, RecordOf } from "immutable";
import { Action } from "redux";

export interface MythicAction<T extends string, P = void> {
  type: T;
  payload: P;
}

export const createMythicActionFunction =
  <T extends MythicAction<string, any>>
  (type: T["type"]) => (payload: T["payload"]) =>
    ({ type, payload });

export const createMyth =
  <PACKAGE extends string, TYPE extends string>(pkg: PACKAGE, type: TYPE) =>
    <PROPS, RECORD extends Record<any> = RecordOf<PROPS>>(definition: {
      reduce?: (state: RECORD, action: MythicAction<TYPE, PROPS>) => RECORD,
    }) => ({
      pkg,
      type,
      action: undefined as unknown as MythicAction<TYPE, PROPS>,
      state: undefined as unknown as RECORD,
      create: createMythicActionFunction<MythicAction<TYPE, PROPS>>(type),
      appliesTo: (action: Action) => action.type === type,
      reduce: definition.reduce && (
        (state: RECORD, action: Action) => {
          if (action.type === type) {
            return definition.reduce!(
              state,
              action as MythicAction<TYPE, PROPS>,
            );
          } else {
            return state;
          }
        }
      )
    });
