import { RecordOf } from "immutable";
import { Action } from "redux";
import { ActionsObservable, Epic } from "redux-observable";
import { Observable } from "rxjs";

export interface Myths<PKG extends string, STATE> {
  [key: string]: Myth<PKG, string, any, STATE>
}

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
  epics: Epic[],

  // The following are all undefined, but can be used in typeof expressions
  props: PROPS,
  state: STATE,
  action: MythicAction<PKG, NAME, PROPS>,

  // Create an action of this Myth
  create: (payload: PROPS) => MythicAction<PKG, NAME, PROPS>,

  // Is this one of our actions?
  appliesTo: (action: Action) => boolean,

  // Determine the successor state, action can be any
  reduce?: (state: RecordOf<STATE>, action: Action) => RecordOf<STATE>,

  // Build a component that can emit actions of this Myth
  createConnectedComponent: <COMPONENT_NAME extends string>(
    componentName: COMPONENT_NAME,
    cls: any,
    makeState: ((state: any) => any) | null,
  ) => any;
}

export type ReducerDefinition<STATE, PROPS> = (
  state: RecordOf<STATE>,
  action: MythicAction<string, string, PROPS>,
) => RecordOf<STATE> | void;

export interface MythDefinition<STATE, PROPS> {
  reduce?: ReducerDefinition<STATE, PROPS>,
  createOn?: (
    action$: ActionsObservable<Action>,
  ) => Observable<PROPS | void>
}

export interface PackageDefinition<STATE> {
  initialState: STATE;
}
