import { AppState } from "@nteract/types";
import { default as Immutable, RecordOf } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Action } from "redux";
import { ActionsObservable, combineEpics, Epic } from "redux-observable";
import { EMPTY, Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";

export interface MythicAction<
  PKG extends string,
  NAME extends string,
  PROPS = void,
> extends Action {
  type: string;
  payload: PROPS;
  error?: boolean;
}

export interface Myth<
  PKG extends string = string,
  NAME extends string = string,
  PROPS = any,
  STATE = any,
> {
  pkg: PKG,
  name: NAME,
  type: string,
  props: PROPS,
  state: STATE,
  action: MythicAction<PKG, NAME, PROPS>,
  create: (payload: PROPS) => MythicAction<PKG, NAME, PROPS>,
  appliesTo: (action: Action) => boolean,
  reduce?: (state: RecordOf<STATE>, action: Action) => RecordOf<STATE>,
  epics: Epic[],
  createConnectedComponent: <COMPONENT_NAME extends string>(
    componentName: COMPONENT_NAME,
    cls: any,
    makeState: ((state: AppState) => any) | null,
  ) => any;
}

export const createMythicPackage =
  <PKG extends string>(pkg: PKG) =>
    <STATE>(packageDefinition: {
      initialState: STATE,
    }) => {
      const myths: { [key: string]: Myth<PKG, string, any, STATE> } = {};

      return {
        name: pkg,
        myths,
        state: undefined as unknown as STATE,
        makeRootEpic: () =>
          combineEpics(
            ...Object.values(myths).map(myth => combineEpics(...myth.epics))
          ),
        rootReducer:
          (
            state: RecordOf<STATE> = Immutable.Record<STATE>(
              packageDefinition.initialState
            )(),
            action: Action,
          ) => {
            const applicableMyths = Object
              .values(myths)
              .filter(myth => myth.appliesTo(action));

            if (applicableMyths.length === 0) {
              return state;
            }
            else if (applicableMyths[0].reduce === undefined) {
              return state;
            }
            else {
              return applicableMyths[0].reduce(state, action);
            }
          },

        createMyth:
          <NAME extends string>(name: NAME) =>
            <PROPS = STATE>(definition: {
              reduce?: (
                state: RecordOf<STATE>,
                action: MythicAction<string, string, PROPS>,
              ) => RecordOf<STATE> | void,
              createOn?: (
                action$: ActionsObservable<Action>,
              ) => Observable<PROPS | void>,
            }): Myth<PKG, NAME, PROPS, STATE> => {
              const type = `${pkg}/${name}`;
              const create = (payload: PROPS) => ({ type, payload });
              const appliesTo = (action: Action) => action.type === type;
              const myth = {
                pkg,
                name,
                type,

                props: undefined as unknown as PROPS,
                state: undefined as unknown as STATE,
                action: undefined as unknown as MythicAction<PKG, NAME, PROPS>,

                create,
                appliesTo,

                reduce: definition.reduce && (
                  (state: RecordOf<STATE>, action: Action) => {
                    if (appliesTo(action)) {
                      return (definition.reduce!(
                        state,
                        action as MythicAction<PKG, NAME, PROPS>,
                      ) || state);
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
                ].filter(epic => epic !== null) as Epic[],

                createConnectedComponent: <
                  COMPONENT_NAME extends string,
                >(
                  componentName: COMPONENT_NAME,
                  cls: any,
                  makeState: ((state: AppState) => any) | null = null,
                ) => {
                  const component = connect(
                    makeState,
                    { [myth.name]: myth.create },
                  )(cls);
                  component.displayName = componentName;
                  return component;
                },
              };

              if (myths.hasOwnProperty(name)) {
                throw new Error(`Package "${pkg}" cannot have two myths with the same name ("${name}")`);
              }

              myths[name] = myth;

              return myth;
            },
      };
    };

export class MythicComponent<MYTH extends Myth, PROPS = {}>
  extends React.PureComponent<{
  [key in MYTH["name"]]: (payload: MYTH["props"]) => void;
} & PROPS> {
  constructor(props: MYTH["props"] & PROPS) {
    super(props);
    this.postConstructor();
  }

  postConstructor(): void {
    // Override in subclasses
  };
}
