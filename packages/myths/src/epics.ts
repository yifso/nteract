import { Action } from "redux";
import { ActionsObservable, combineEpics, Epic } from "redux-observable";
import { EMPTY, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { MythDefinition, MythicAction, Myths } from "./types";

export const makeEpics = <
  PKG extends string,
  NAME extends string,
  STATE,
  PROPS,
>(
  create: (payload: PROPS) => MythicAction<PKG, NAME, PROPS>,
  definition: MythDefinition<STATE, PROPS>,
) => {
  const epics: Epic[] = [];

  if (definition.createOn) {
    epics.push(
      (action$: ActionsObservable<Action>) =>
        definition.createOn!(action$).pipe(
          mergeMap(props => props ? of(create(props)) : EMPTY),
        )
    );
  }

  return epics;
};

export const makeMakeRootEpic = <PKG extends string, STATE>(
  myths: Myths<PKG, STATE>,
) =>
  () =>
    combineEpics(
      ...Object.values(myths).map(myth => combineEpics(...myth.epics))
    );
