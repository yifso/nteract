import { Toaster } from "@blueprintjs/core";
import { Record, RecordOf } from "immutable";
import React, { RefObject } from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ActionsObservable, Epic } from "redux-observable";
import { EMPTY, Observable, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { initializeSystem, NotificationRoot } from "../..";
import { blueprintjsNotificationSystem } from "../../backends/blueprintjs";

export interface MythicAction<T extends string, P = void> {
  type: T;
  payload: P;
}

export const createMythicActionFunction =
  <T extends MythicAction<string, any>>
  (type: T["type"]) => (payload: T["payload"]) =>
    ({ type, payload });

export interface Myth<
  PACKAGE extends string = any,
  NAME extends string = any,
  TYPE extends string = any,
  PROPS = any,
  RECORD extends Record<any> = any,
> {
  pkg: PACKAGE,
  name: NAME,
  type: TYPE,
  props: PROPS,
  action: MythicAction<TYPE, PROPS>,
  state: RECORD,
  create: (payload: PROPS) => MythicAction<TYPE, PROPS>,
  appliesTo: (action: Action) => boolean,
  reduce?: (state: RECORD, action: Action) => RECORD,
  epics: Epic[],
}

export const createMyth =
  <PACKAGE extends string, NAME extends string, TYPE extends string>(pkg: PACKAGE, name: NAME, type: TYPE) =>
    <PROPS, RECORD extends Record<any> = RecordOf<PROPS>>(definition: {
      reduce?: (
        state: RECORD,
        action: MythicAction<TYPE, PROPS>,
      ) => RECORD | void,
      createOn?: (
        action$: ActionsObservable<Action>,
      ) => Observable<PROPS | void>,
    }): Myth<PACKAGE, NAME, TYPE, PROPS, RECORD> => {
      const create = createMythicActionFunction<MythicAction<TYPE, PROPS>>(type);

      return {
        pkg,
        name,
        type,
        props: undefined as unknown as PROPS,
        action: undefined as unknown as MythicAction<TYPE, PROPS>,
        state: undefined as unknown as RECORD,
        create,
        appliesTo: (action: Action) => action.type === type,
        reduce: definition.reduce && (
          (state: RECORD, action: Action) => {
            if (action.type === type) {
              return (definition.reduce!(
                state,
                action as MythicAction<TYPE, PROPS>,
              ) ?? state) as RECORD;
            } else {
              return state;
            }
          }
        ),
        epics: [
          definition.createOn !== undefined
            ? (action$: ActionsObservable<Action>) =>
              definition.createOn!(action$).pipe(
                mergeMap(props => props ? of(create(props)) : EMPTY),
              )
            : null,
        ].filter(epic => epic !== null) as Epic[]
      };
    };

export class MythicComponent<MYTH extends Myth>
  extends React.PureComponent<{
  [key in MYTH["name"]]: (payload: MYTH["props"]) => void;
}> {
  constructor(props: any) {
    super(props);
    this.postConstructor();
  }

  postConstructor(): void {
    // Override in subclasses
  };
}

export const createMythicConnectedComponent = <
  NAME extends string,
  MYTH extends Myth,
>(
  name: NAME,
  myth: MYTH,
  cls: any,
) => {
  const component = connect(
    null,
    { [myth.name]: myth.create },
  )(cls);

  component.displayName = "NotificationRoot";
  return component;
};
