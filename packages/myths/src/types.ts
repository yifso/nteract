import { RecordOf } from "immutable";
import { Action, Reducer } from "redux";
import { Epic } from "redux-observable";

export interface Myths<PKG extends string, STATE> {
  [key: string]: Myth<PKG, string, any, STATE>
}

export interface MythicAction<
  PKG extends string = string,
  NAME extends string = string,
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

export interface MythicPackage<
  PKG extends string = string,
  STATE = any
> {
  name: PKG;
  myths: Myths<PKG, STATE>;

  // The following is undefined, but can be used in typeof expressions
  state: STATE;

  makeRootEpic: () => Epic;
  rootReducer: Reducer<RecordOf<STATE>, MythicAction>;
  createMyth: <NAME extends string>(name: NAME) =>
    <PROPS>(definition: MythDefinition<STATE, PROPS>) =>
      Myth<PKG, NAME, PROPS, STATE>;
}

export type ReducerDefinition<STATE, PROPS> = (
  state: RecordOf<STATE>,
  action: MythicAction<string, string, PROPS>,
) => RecordOf<STATE> | void;

export interface MythDefinition<STATE, PROPS> {
  reduce?: ReducerDefinition<STATE, PROPS>;
  epics?: Array<EpicDefinition<PROPS>>;
}

export interface CreateEpicDefinition<PROPS> {
  on: (action: MythicAction) => boolean;
  create: (action: MythicAction) => PROPS | void;
}

export type EpicDefinition<PROPS> =
  | CreateEpicDefinition<PROPS>
  ;

export interface PackageDefinition<STATE> {
  initialState: STATE;
}
