import { AnyAction } from "redux";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { binder } from "rx-binder";
import * as actions from "./actions";

import {
  actions as nteractActions,
  AppState,
  createHostRef,
  createKernelspecsRef,
  makeJupyterHostRecord
} from "@nteract/core";

import { of } from "rxjs";

import {
  catchError,
  filter,
  mergeMap,
  switchMap,
  withLatestFrom
} from "rxjs/operators";

export const launchServerEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<AppState>
) =>
  action$.pipe(
    ofType(actions.LAUNCH_SERVER),
    // Definitely do not run this on the server side
    filter(() => typeof window !== "undefined"),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const repo = state.webApp.get("repo");
      const gitref = state.webApp.get("gitRef");

      return binder({ repo, gitref }, EventSource).pipe(
        mergeMap(message => {
          console.log(message);
          const actionsArray = [
            {
              type: "ADD_SERVER_MESSAGE",
              payload: { message }
            }
          ];
          if (message.phase === "ready") {
            const hostRef = createHostRef();
            const config = {
              origin: message.url.replace(/\/\s*$/, ""),
              basePath: "/",
              token: message.token,
              crossDomain: true,
              id: hostRef
            };
            actionsArray.push(
              nteractActions.setAppHost(makeJupyterHostRecord(config))
            );
            const kernelspecsRef = createKernelspecsRef();
            actionsArray.push(
              nteractActions.fetchKernelspecs({ hostRef, kernelspecsRef })
            );
          }
          return of(...actionsArray);
        }),
        catchError(error => of({ type: "error", payload: { serverId, error } }))
      );
    })
  );
